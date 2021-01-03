const express = require('express');
const app = express();
const TronWeb = require('tronweb')
const HttpProvider = TronWeb.providers.HttpProvider; 
const fullNode = new HttpProvider("https://api.trongrid.io/");
const solidityNode = new HttpProvider("https://api.trongrid.io/");
const eventServer = new HttpProvider("https://api.trongrid.io/");
app.get('/',(req,res)=>{
    res.send('Welcome To MoneyTransfer By Ocean Software Team | SoftwareDepartment@ocgate.com');
});
// define a simple route
app.get('/api/moneytransfer/:privkey/:owneraddress/:toaddress/:money', (req, res) => {
    var privkey = req.params.privkey;
    var owneraddress = req.params.owneraddress;
    var toaddress = req.params.toaddress;
    var money = req.params.money;
    console.log(privkey+'\n'+owneraddress+'\n'+toaddress+'\n'+money);
    var result = triggerSmartContract(privkey,owneraddress,toaddress,money).then(output => res.json(output)).catch(res.json({ id: 0 }));
   // res.json({"message": S});
  // res.send('Private key => '+privkey+'\n'+'Owner Address =>'+owneraddress+'\n'+'To Address => '+toaddress+'\n'+'Money Count =>'+money);
  //console.log(result);
  res.json(result);
});
app.listen(process.env.PORT || 3000,()=>{
    console.log('Server Is listen On Port 3001');
});
async function triggerSmartContract(privatekey,owner,to,moneyc) {
    const tronWeb = new TronWeb(fullNode,solidityNode,eventServer,privatekey);
    const trc20ContractAddress = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";//contract address
    var address = owner;
    
    try {
        let contract = await tronWeb.contract().at(trc20ContractAddress);
        //Use send to execute a non-pure or modify smart contract method on a given smart contract that modify or change values on the blockchain.
        // These methods consume resources(bandwidth and energy) to perform as the changes need to be broadcasted out to the network.
        let result = await contract.transfer(
            to, //address _to
            moneyc   //amount
        ).send({
            feeLimit: 1000000
        }).then(output => {return output});   //console.log('- Output:', output, '\n');
        //console.log('result: ', result);
        return result;
    } catch(error) {
       //console.error("trigger smart contract error",error)
       //print(error);
        //return error;
    }
}
