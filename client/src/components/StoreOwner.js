import React, { Component } from "react";
import truffleContract from "truffle-contract";


class StoreOwner extends React.Component {
constructor(props) {
    super(props);
    this.state = { storefrontvalue: '',selectstorevalue: '', StoreBalance: '', ProductList: [],ProdName:'',ProdPrice: '',ProdQty: '',ProdSku: '',ProdNameEdit:'',ProdPriceEdit: '',ProdQtyEdit: '',ProdSkuEdit: '',PendingStores: [], ApprovedStores: [],SelectList: [], web3: this.props.web3, accounts: this.props.accounts, contract: this.props.contract };
    }


  componentDidMount = async () => {
  try {

      this.runExample();
      
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleSubmitWithBalance = this.handleSubmitWithBalance.bind(this);

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.` + error
      );
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;
    let _PendingStores = [];
    let _ApprovedStores = [];
    let _SelectList = [];
    let counter = 0 
    // Get the value from the contract to prove it worked.
    const _StoreBalance = await contract.viewStoreBalance.call({ from: accounts[0] });
    //alert(
        //`Your store balance is:` + _StoreBalance
    //);

    // Get all storefront ids from the contract.
    const _StoreFrontIds = await contract.getStoreFrontIds.call({ from: accounts[0] });

    for (let userObject of _StoreFrontIds) {
	
      // Get the value from the contract to prove it worked.
      const _StoreFront = await contract.getStoreFrontbyId.call(userObject, { from: accounts[0] });

	if(_StoreFront[3])
        {
	  if(counter == 0)
          {
		this.state.selectstorevalue = _StoreFront[0];
                counter += 1;
           }
	  _ApprovedStores.push(_StoreFront[0] );	
          _SelectList.push({Name:_StoreFront[0] ,Id: userObject });	
        }

         //Create the parent and add the children
         _PendingStores.push(_StoreFront[0] );


    }
   
    // Update state with the result.
    this.setState({ storefrontvalue: '',StoreBalance: _StoreBalance, PendingStores: _PendingStores, ApprovedStores: _ApprovedStores, SelectList: _SelectList});
    this.RefreshProductList();
  };


  handleChange(event) {

     this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {

  event.preventDefault();
  const { accounts, contract } = this.state;	
  var value = this.state.storefrontvalue;
  
    alert(
        `Adding a new Store Front ` + value
      	);

        contract.createStoreFront(value, {from : accounts[0]})
        .then(result => {  		
		this.runExample();
        	this.forceUpdate(); 
        });
	this.setState({ storefrontvalue: '',storeownervalue: ''});
  }

  handleSubmitWithBalance(event) {

  event.preventDefault();
  const { accounts, contract } = this.state;	
  var value = this.state.StoreBalance;
  
    alert(
        `Withdraw balance of ` + value
      	);

        contract.withdraw({from : accounts[0]})
        .then(result => {         
		this.runExample();
        	this.forceUpdate(); 
        });
	this.setState({ StoreBalance: ''});

  }

  async handleSubmitMngStore(event) {

  event.preventDefault();
  this.RefreshProductList();
  
  }

async RefreshProductList() { 
const { accounts, contract } = this.state;	
  var value = this.state.selectstorevalue;
  const _ProductList = []
  
      // iterate through our children searching for the <CustomOption /> that was just selected
	 for (let listitem of this.state.SelectList)
	{
		if(listitem.Name == value)
		{

		    // Get all product ids from the contract.
		    const _ProductIds = await contract.getProductCountbyStoreId.call(listitem.Id, { from: accounts[0] })
			alert(
				`Total products for this store is ` + _ProductIds
			  	);
		    for (let i = 0; i < _ProductIds; i++) {
			
		      // Get the value from the contract to prove it worked.
		      const _Product = await contract.getProductbysku.call( listitem.Id, i, { from: accounts[0] });
				
		      _ProductList.push({Name:_Product[0] ,Price: _Product[1],Quantity: _Product[2],Sku:  i});
		    }
                      this.setState({ ProductList: _ProductList});

		}
	}   
  return true;
}

 async handleAddNewProduct(event) {

  event.preventDefault();
  const { accounts, contract } = this.state;	
  var value = this.state.selectstorevalue;
  const _ProductList = []
  this.setState({ ProductList: []});
     alert(
        `Adding a new product for ` + value
      	);

      // iterate through our children searching for the <CustomOption /> that was just selected
	for (let listitem of this.state.SelectList)
	{
		if(listitem.Name == value)
		{
		    // Get all product ids from the contract.
		    await contract.addProduct(listitem.Id,this.state.ProdName,this.state.ProdPrice,this.state.ProdQty, { from: accounts[0] });
 
		}
	} 
        this.RefreshProductList();
	this.forceUpdate();

  }
 async handleUpdateProduct(event) {

  event.preventDefault();
  const { accounts, contract } = this.state;	
  var value = this.state.selectstorevalue;
  const _ProductList = []
  this.setState({ ProductList: []});


      // iterate through our children searching for the <CustomOption /> that was just selected
	for (let listitem of this.state.SelectList)
	{
		if(listitem.Name == value)
		{
		    // Get all product ids from the contract.
		    await contract.updateProduct(listitem.Id,this.state.ProdSku, this.state.ProdName,this.state.ProdPrice,this.state.ProdQty, { from: accounts[0] });
 
		}
	} 
        this.RefreshProductList();
	this.forceUpdate();

  }



  render() {

    var pendingstorelist = this.state.PendingStores;
    var approvedstorelist = this.state.ApprovedStores; 
    let optionItems = this.state.SelectList.map((stores) =>
                <option key={stores.Id}>{stores.Name}</option>
            );

    return ( 	
      <form onSubmit={this.handleSubmit.bind(this)}>

       <h3>You are logged in as STORE OWNER</h3>


    	<div>
        <div id="result">Store Balance: {String(this.state.StoreBalance)} </div>
        <button onClick={this.handleSubmitWithBalance.bind(this)}>Withdraw</button>
	</div>  
	<br/>	


       <p>
        <label>
          Add a new Store Front:
          <input type="text" ref="storefrontinput" name="storefrontvalue" value={this.state.storefrontvalue} onChange={this.handleChange} placeholder="Enter Store Name i.e. Walmart..."/>
        </label>
        <button type="submit">Add</button>
	</p>
	<ul> 	
		<div id="result">List of Store Fronts:</div>
                {pendingstorelist.map(function(pendingstorelist, index){
                    return <li key={ index }>{pendingstorelist}</li>;
                  })}
            </ul>       
	 <br/>


 	<div>
        <label>
          Manage Approved Stores:
        </label>  
           <select onChange={this.handleChange} ref="selectstorevalue" name="selectstorevalue" value={this.state.selectstorevalue} > 
               {optionItems}
           </select>
          <button onClick={this.handleSubmitMngStore.bind(this)}>Manage</button>
         </div> 

 	<div className="ManageStores" >
        <h4 style={{color: "Navy"}}> Welcome to {this.state.selectstorevalue}</h4> 
        <label>
          Add new Product:
        </label>  
	<table className="table table-bordered">
        <thead>
            <tr>
                <th>Product Name</th>
                <th>Price </th>
                <th>Qty</th>
            </tr>
        </thead>
        <tbody>
                <tr>
                        <td><input type="text" ref="ProdName" name="ProdName" value={this.state.ProdName} placeholder="Sofa" onChange={this.handleChange}/></td>
			<td><input ref="ProdPrice" name="ProdPrice"  value={this.state.ProdPrice}  type="currency"  onChange={this.handleChange} /></td>
                        <td><input ref="ProdQty" name="ProdQty" value={this.state.ProdQty} type="number" onChange={this.handleChange} /></td>                         	
			<td><button onClick={this.handleAddNewProduct.bind(this)}>Add Product</button></td>		                   
                 </tr>

        </tbody>
     </table>
 	<br/>


	 <label>
          Update Product:
        </label>
       <table className="table table-bordered">
        <thead>
            <tr>
                <th>Product Name</th>
                <th>Price </th>
                <th>Qty</th>
                <th>SKU</th>
            </tr>
        </thead>
        <tbody>
            {this.state.ProductList.map((row, index) => {
                return (
                    <tr key={index}>
                        <td><input type='text' ref="ProdNameEdit" name="ProdNameEdit" className='form-control' step='1' min="1" value={row.Name} onChange={this.handleChange} /></td>
			<td><input type='currency' ref="ProdPriceEdit" name="ProdPriceEdit"  value={this.state.ProdPriceEdit} className='form-control' step='1' min="1" value={row.Price} onChange={this.handleChange} /></td>
                        <td><input type='number' ref="ProdQtyEdit" name="ProdQtyEdit" value={this.state.ProdQtyEdit} className='form-control' step='1' min="1" value={row.Quantity} onChange={this.handleChange} /></td>   
                        <td><input readonly="readonly"  ref="ProdSkuEdit" name="ProdSkuEdit" value={this.state.ProdSkuEdit} type="number"  value={row.Sku}/></td> 
			<td><button onClick={this.handleUpdateProduct.bind(this)}>Update Product</button></td>  
			<td><button onClick={this.handleSubmitMngStore.bind(this)}>Delete Product</button></td>                       
                    </tr>
                );
            })}
        </tbody>
     </table>
     </div>

     </form>	
    );
  }
}
export default StoreOwner;
