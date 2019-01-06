import React, { Component } from "react";
import truffleContract from "truffle-contract";


class StoreOwner extends React.Component {
constructor(props) {
    super(props);
    this.state = { welcomevalue: '',storefrontvalue: '',selectstorevalue: '',selectskuvalue: '',selectskuvaluedelete : '', StoreBalance: '', ProductList: [],ProdName:'',ProdPrice: '',ProdQty: '',ProdSku: '',ProdNameEdit:'',ProdPriceEdit: '',ProdQtyEdit: '',ProdSkuEdit: '',PendingStores: [], ApprovedStores: [],SelectList: [], web3: this.props.web3, accounts: this.props.accounts, contract: this.props.contract };

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
    this.setState({ storefrontvalue: '',StoreBalance: _StoreBalance, PendingStores: _PendingStores, ApprovedStores: _ApprovedStores, SelectList: _SelectList, ProductList: []});
    this.RefreshProductList();
  };



  handleChange(event) {

     this.setState({ [event.target.name]: event.target.value });
  }

  handleChangeMngStore(event) {

     this.setState({ [event.target.name]: event.target.value });
     this.setState({ welcomevalue: ''});
  }

 async handleChangeskudelete(event) {
 this.setState({ selectskuvaluedelete: event.target.value });
}

  async handleChangesku(event) {

     this.setState({ [event.target.name]: event.target.value });
     const { accounts, contract } = this.state;	
     var storevalue = this.state.selectstorevalue;
     var storevalue = this.state.selectstorevalue;
     for (let listitem of this.state.SelectList)
	{
		if(listitem.Name == storevalue)
		{

		       // Get the value from the contract to prove it worked.
			const _Product = await contract.getProductbysku.call( listitem.Id, event.target.value, { from: accounts[0] });
						
			this.setState({ProdNameEdit:_Product[0] ,ProdPriceEdit: _Product[1],ProdQtyEdit: _Product[2] });
			this.forceUpdate(); 	    
     			this.setState({ selectskuvalue: event.target.value });
		}
	}  
  }  


  handleSubmit(event) {

  event.preventDefault();
  const { accounts, contract } = this.state;	
  var value = this.state.storefrontvalue;
  if(!value)
  {
   alert(
        `Store name can't be empty ` + value
      	);
   }
  else
  {
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
  this.setState({ ProdNameEdit: '',ProdPriceEdit: '',ProdQtyEdit: ''});  
  }

async RefreshProductList() { 
const { accounts, contract } = this.state;	
var value = this.state.selectstorevalue;
const _ProductList = []
let counter = 0;
  
      // iterate through our children searching for the <CustomOption /> that was just selected
	for (let listitem of this.state.SelectList)
	{
		if(listitem.Name == value)
		{
		    // Get all product ids from the contract.
		    const _ProductIds = await contract.getProductCountbyStoreId.call(listitem.Id, { from: accounts[0] })
		    for (let i = 0; i < _ProductIds; i++) {
			
		      // Get the value from the contract to prove it worked.
		      const _Product = await contract.getProductbysku.call( listitem.Id, i, { from: accounts[0] });

		       if(!_Product[3])	
			{
				if(counter== 0)
				{
					this.setState({ProdNameEdit:_Product[0] ,ProdPriceEdit: _Product[1],ProdQtyEdit: _Product[2], selectskuvalue : i });
				}	
		      		_ProductList.push({Name:_Product[0] ,Price: _Product[1],Quantity: _Product[2],Sku:  i});
			        counter++;
			}

		    }
                      this.setState({ ProductList: _ProductList});

		}

	}   
 this.setState({ ProdName: '',ProdPrice: '',ProdQty: '',welcomevalue: value});
 this.forceUpdate();
 return true;
}

 async handleAddNewProduct(event) {

  event.preventDefault();
  const { accounts, contract } = this.state;	
  var value = this.state.selectstorevalue;
  const _ProductList = []
  this.setState({ ProductList: []});
  if(!this.state.ProdName || !this.state.ProdPrice || !this.state.ProdQty)
  {
   alert(
        `Product information can't be empty ` 
      	);
      return;
   }
   

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
  if(!this.state.ProdNameEdit || !this.state.ProdPriceEdit || !this.state.ProdQtyEdit)
  {
   alert(
        `Product information can't be empty ` 
      	);
      return;
   }
     alert(
        `Updating the product ` + this.state.ProdQtyEdit
      	);
      // iterate through our children searching for the <CustomOption /> that was just selected
	for (let listitem of this.state.SelectList)
	{
		if(listitem.Name == value)
		{
		    // Get all product ids from the contract.
		    await contract.updateProduct(listitem.Id,this.state.selectskuvalue, this.state.ProdNameEdit,this.state.ProdPriceEdit,this.state.ProdQtyEdit, { from: accounts[0] });
 
		}
	} 
        this.RefreshProductList();
	this.forceUpdate();

  }


async handleRemoveProduct(event) {

  event.preventDefault();
  const { accounts, contract } = this.state;	
  var value = this.state.selectstorevalue;
  const _ProductList = []
  this.setState({ ProductList: []});

     alert(
        `Removing the product ` + this.state.selectskuvaluedelete
      	);

      // iterate through our children searching for the <CustomOption /> that was just selected
	for (let listitem of this.state.SelectList)
	{
		if(listitem.Name == value)
		{
		    // Get all product ids from the contract.
		    await contract.removeProduct(listitem.Id,this.state.selectskuvaluedelete, { from: accounts[0] });
 
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
   let optionItemsProd = this.state.ProductList.map((products) =>
                <option key={products.Sku}>{products.Sku}</option>
            );

    return ( 	
      <form onSubmit={this.handleSubmit.bind(this)}>

       <h3>You are logged in as STORE OWNER</h3>


    	<div>
        <div id="result">
        <label>
          Store Balance: 
        </label>
        {String(this.state.StoreBalance)}         
        <button onClick={this.handleSubmitWithBalance.bind(this)}>Withdraw</button> </div>
	</div>  
	<br/>	


       <p>
        <label>
          Add a new Store Front
        </label>
          <input type="text" ref="storefrontinput" name="storefrontvalue" value={this.state.storefrontvalue} onChange={this.handleChange} placeholder="Enter Store Name i.e. Walmart..."/>

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
          Manage Approved Stores
        </label>  
           <select onChange={this.handleChangeMngStore.bind(this)} ref="selectstorevalue" name="selectstorevalue" value={this.state.selectstorevalue} > 
               {optionItems}
           </select>
          <button onClick={this.handleSubmitMngStore.bind(this)}>Load Products</button>
         </div> 

 	<div className="ManageStores" >
        <h3> Welcome to {this.state.welcomevalue}</h3> 
 	<div className="ManageStoresChild" >      

	<h4>
          Available Products
        </h4>  
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
                        <td><input type='text' ref="ProdNameEdit" name="ProdNameEdit" className='form-control' defaultValue="Hello!" value={row.Name}  /></td>
			<td><input type='currency' ref="ProdPriceEdit" name="ProdPriceEdit" className='form-control' step='1' min="1" value={row.Price} /></td>
                        <td><input type='number' ref="ProdQtyEdit" name="ProdQtyEdit" className='form-control' step='1' min="1" value={row.Quantity} /></td>   
                        <td><input readonly="readonly"  ref="ProdSkuEdit" name="ProdSkuEdit" type="number"  value={row.Sku}/></td>                     
                    </tr>
                );
            })}
        </tbody>
     </table><br/>

	<h4>
          Add Product
        </h4>  
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


	<h4>
          Update Product
        </h4>
	<label>
          Select Product SKU
        </label>  
	<select onChange={this.handleChangesku.bind(this)} ref="selectskuvalue" name="selectskuvalue" > 
               {optionItemsProd}
           </select>
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
                        <td><input type="text" ref="ProdNameEdit" name="ProdNameEdit" value={this.state.ProdNameEdit} onChange={this.handleChange}/></td>
			<td><input ref="ProdPriceEdit" name="ProdPriceEdit"  value={this.state.ProdPriceEdit}  type="currency"  onChange={this.handleChange} /></td>
                        <td><input ref="ProdQtyEdit" name="ProdQtyEdit" value={this.state.ProdQtyEdit} type="number" onChange={this.handleChange} /></td>                       	
			<td><button onClick={this.handleUpdateProduct.bind(this)}>Update Product</button></td>		                   
                 </tr>

        </tbody>
     </table>
 	<br/>


	<h4>
          Remove Product
        </h4> 
	<label>
          Select Product SKU 
        </label> 
	<select onChange={this.handleChangeskudelete.bind(this)} ref="selectskuvaluedelete" name="selectskuvaluedelete" value={this.state.selectskuvaluedelete} > 
               {optionItemsProd}
           </select>
       <button onClick={this.handleRemoveProduct.bind(this)}>Remove Product</button>
	<br/>
     </div>
     </div>
     </form>	
    );
  }
}
export default StoreOwner;
