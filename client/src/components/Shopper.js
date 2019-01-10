import React, { Component } from "react";
import truffleContract from "truffle-contract";


class Shopper extends React.Component {
constructor(props) {
    super(props);

    this.state = { welcomevalue: '',selectstorevalue: '',selectskuvalue: '', ProductList: [],ProdNameEdit:'',ProdPriceEdit: '',ProdQtyEdit: '', ApprovedStores: [],SelectList: [], web3: this.props.web3, accounts: this.props.accounts, contract: this.props.contract };
    }


  componentDidMount = async () => {
  try {

      this.runExample();
      
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.` + error
      );
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;
    let _ApprovedStores = [];
    let _SelectList = [];
    let counter = 0 


    // Get all storefront ids from the contract.
    const _StoreFrontIds = await contract.getStoreFrontCount.call({ from: accounts[0] });

    for (let i=0; i< _StoreFrontIds; i++) {
	
      // Get each store front from the contract.
      const _StoreFront = await contract.getStoreFrontbyId.call(i, { from: accounts[0] });
	if(_StoreFront[3])
        {
	  if(counter == 0)
          {
		this.state.selectstorevalue = _StoreFront[0];
                counter += 1;
           }
	  _ApprovedStores.push(_StoreFront[0] );	
          _SelectList.push({Name:_StoreFront[0] ,Id: i });	
        }

    }
   
    // Update state with the result.
    this.setState({  ApprovedStores: _ApprovedStores, SelectList: _SelectList, ProductList: []});
    this.RefreshProductList();
  };



  handleChange(event) {

     this.setState({ [event.target.name]: event.target.value });
  }

  handleChangeMngStore(event) {

     this.setState({ [event.target.name]: event.target.value });
     this.setState({ welcomevalue: ''});
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
     			this.setState({ selectskuvalue: event.target.value });
			this.forceUpdate(); 

    
		}
	}  
  }  
 

 

  handleSubmit(event) {

  event.preventDefault();

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
			    if(_Product[2] > 0){
				if(counter== 0)
				{
					this.setState({ProdNameEdit:_Product[0] ,ProdPriceEdit: _Product[1],ProdQtyEdit: _Product[2], selectskuvalue : i});
				}	
		      		_ProductList.push({Name:_Product[0] ,Price: _Product[1],Quantity: _Product[2],Sku:  i});
			        counter++;
			   }
			}

		    }
                      this.setState({ ProductList: _ProductList});

		}

	}   
 this.setState({ welcomevalue: value});
 this.forceUpdate();
 return true;
}

 async handlePurchaseProduct(event) {

  event.preventDefault();
  const { accounts, contract } = this.state;	
  var value = this.state.selectstorevalue;
  const _ProductList = []
  this.setState({ ProductList: []});

      alert(
        `Withdrawing amount of ` + this.state.ProdPriceEdit + ` from your account.`
      	);
      // iterate through our children searching for the <CustomOption /> that was just selected
	for (let listitem of this.state.SelectList)
	{
		if(listitem.Name == value)
		{
		    // Get all product ids from the contract.
		    await contract.purchaseProduct(listitem.Id,this.state.selectskuvalue, { from: accounts[0],value: this.state.ProdPriceEdit });
 
		}
	} 
        this.RefreshProductList();
	this.forceUpdate();

  }



  render() {

    var approvedstorelist = this.state.ApprovedStores; 
    let optionItems = this.state.SelectList.map((stores) =>
                <option key={stores.Id}>{stores.Name}</option>
            );
   let optionItemsProd = this.state.ProductList.map((products) =>
                <option key={products.Sku}>{products.Sku}</option>
            );

    return ( 	
      <form onSubmit={this.handleSubmit.bind(this)}>

       <h3>You are logged in as SHOPPER</h3>


 	<div>
        <label>
          Shop at these stores
        </label>  
           <select onChange={this.handleChangeMngStore.bind(this)} ref="selectstorevalue" name="selectstorevalue" value={this.state.selectstorevalue} > 
               {optionItems}
           </select>
          <button onClick={this.handleSubmitMngStore.bind(this)}>Browse Products</button>
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
                        <td><input type='text' className='form-control' value={row.Name}  /></td>
			<td><input type='currency'className='form-control' step='1' min="1" value={row.Price} /></td>
                        <td><input type='number' className='form-control' step='1' min="1" value={row.Quantity} /></td>   
                        <td><input readonly="readonly"  type="number"  value={row.Sku}/></td>                     
                    </tr>
                );
            })}
        </tbody>
     </table><br/>
	

	<h4>
          Purchase Product
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
                        <td><input readonly="readonly" type="text" ref="ProdNameEdit" name="ProdNameEdit" value={this.state.ProdNameEdit} onChange={this.handleChange}/></td>
			<td><input readonly="readonly" ref="ProdPriceEdit" name="ProdPriceEdit"  value={this.state.ProdPriceEdit}  type="currency"  onChange={this.handleChange} /></td>
                        <td><input readonly="readonly" ref="ProdQtyEdit" name="ProdQtyEdit" value={1} type="number" onChange={this.handleChange} /></td>                       	
			<td><button onClick={this.handlePurchaseProduct.bind(this)}>Buy Product</button></td>		                   
                 </tr>

        </tbody>
     </table>
 	<br/>
         </div>
         </div> 
     </form>	
    );
  }
}
export default Shopper;
