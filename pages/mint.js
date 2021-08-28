import Head from 'next/head'
import Web3 from "web3";
import { useState, useEffect } from 'react';

import {ADDRESS, ABI} from "../config.js"

export default function Mint() {

  // FOR WALLET
  const [signedIn, setSignedIn] = useState(false)

  const [walletAddress, setWalletAddress] = useState(null)

  // FOR MINTING
  const [how_many_nfheroes, set_how_many_nfheroes] = useState(1)

  const [nfheroContract, setNFHeroContract] = useState(null)

  // INFO FROM SMART Contract

  const [totalSupply, setTotalSupply] = useState(0)

  const [saleStarted, setSaleStarted] = useState(false)

  const [nfheroPrice, setNFHeroPrice] = useState(0)

  useEffect( async() => { 

    signIn()

  }, [])

  async function signIn() {
    if (typeof window.web3 !== 'undefined') {
      // Use existing gateway
      window.web3 = new Web3(window.ethereum);
     
    } else {
      alert("No Ethereum interface injected into browser. Read-only access");
    }

    window.ethereum.enable()
      .then(function (accounts) {
        window.web3.eth.net.getNetworkType()
        // checks if connected network is mainnet (change this to rinkeby if you wanna test on testnet)
        .then((network) => {console.log(network);if(network != "ropsten"){alert("You are on " + network+ " network. Change network to mainnet or you won't be able to do anything here")} });  
        let wallet = accounts[0]
        setWalletAddress(wallet)
        setSignedIn(true)
        callContractData(wallet)

  })
  .catch(function (error) {
  // Handle error. Likely the user rejected the login
  console.error(error)
  })
  }

//

  async function signOut() {
    setSignedIn(false)
  }
  
  async function callContractData(wallet) {
    // let balance = await web3.eth.getBalance(wallet);
    // setWalletBalance(balance)
    const nfheroContract = new window.web3.eth.Contract(ABI, ADDRESS)
    setNFHeroContract(nfheroContract)

    const salebool = await nfheroContract.methods.saleIsActive().call() 
    // console.log("saleisActive" , salebool)
    setSaleStarted(salebool)

    const totalSupply = await nfheroContract.methods.totalSupply().call() 
    setTotalSupply(totalSupply)

    const nfheroPrice = await nfheroContract.methods.nfheroPrice().call() 
    setNFHeroPrice(nfheroPrice)
   
  }
  
  async function mintNFHero(how_many_nfheroes) {
    if (nfheroContract) {
 
      const price = Number(nfheroPrice)  * how_many_nfheroes 

      const gasAmount = await nfheroContract.methods.mintNFHero(how_many_nfheroes).estimateGas({from: walletAddress, value: price})
      console.log("estimated gas",gasAmount)

      console.log({from: walletAddress, value: price})

      nfheroContract.methods
            .mintNFHero(how_many_nfheroes)
            .send({from: walletAddress, value: price, gas: String(gasAmount)})
            .on('transactionHash', function(hash){
              console.log("transactionHash", hash)
            })
          
    } else {
        console.log("Wallet not connected")
    }
    
  };

  



  return (
    <div id="bodyy" className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>Non Fungible Heroes</title>
        <link rel="icon" href="/images/favicon-32x32.png" />
        <meta property="og:title" content="Non Fungible Heroes" key="ogtitle" />
        <meta property="og:description" content="Introducing Non Fungible Heroes" key="ogdesc" />
        <meta property="og:type" content="website" key="ogtype" />
        <meta property="og:url" content="https://nfheroes.com/" key="ogurl" />
        <meta property="og:image" content="https://nfheroes.com/images/hero.gif" key="ogimage" />
        <meta property="og:site_name" content="https://nfheroes.com/" key="ogsitename" />
        <meta name="twitter:card" content="summary_large_image" key="twcard" />
        <meta property="twitter:domain" content="nfheroes.co" key="twdomain" />
        <meta property="twitter:url" content="https://nfheroes.com/" key="twurl" />
        <meta name="twitter:title" content="NFHeroes Co." key="twtitle" />
        <meta name="twitter:description" content="Introducing Non Fungible Heroes" key="twdesc" />
        <meta name="twitter:image" content="https://nfheroes.com/images/hero.gif" key="twimage" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" integrity="sha512-1ycn6IcaQQ40/MKBW2W4Rhis/DbILU74C1vSrLJxCq57o941Ym01SwNsOMqvEBFlcgUa6xLiPY/NS5R+E6ztJQ==" crossorigin="anonymous" referrerpolicy="no-referrer" />
      </Head>
      <div >
        <div className="flex items-center justify-between w-full border-b-2	pb-6">
          <a href="/" className=""><img src="images/hero.gif" width="108" alt="" className="logo-image" /></a>
          <nav className="flex flex-wrap flex-row justify-around ReallyFree">
            <a href="#about" className="text-4xl text-white hover:text-black m-6">About</a>
            <a href="/mint" className="text-4xl text-white hover:text-black m-6">MINT!</a>
            <a href="#traits" className="text-4xl text-white hover:text-black m-6">NFHero traits</a>
            <a href="#roadmap" className="text-4xl text-white hover:text-black m-6">Roadmap</a>
            <a href="#contact" className="text-4xl text-white hover:text-black m-6">Contact</a>
            <a href="https://twitter.com/NFHER0ES" className="text-4xl  hover:text-white m-6 text-blue-600">TWITTER</a>
            <a href="https://discord.gg/c68dqTDtGY" className="text-4xl  hover:text-white m-6 text-blue-600">DISCORD</a>
          </nav>   
          </div>
          <div className="flex auth my-8 font-bold  justify-center items-center vw2">
            {!signedIn ? <button onClick={signIn} className="montserrat inline-block border-2 border-black bg-white border-opacity-100 no-underline hover:text-black py-2 px-4 mx-4 shadow-lg hover:bg-blue-500 hover:text-gray-100">Connect Wallet with Metamask</button>
            :
            <button onClick={signOut} className="montserrat inline-block border-2 border-black bg-white border-opacity-100 no-underline hover:text-black py-2 px-4 mx-4 shadow-lg hover:bg-blue-500 hover:text-gray-100">Wallet Connected: {walletAddress}</button>}
          </div>
        </div>

        <div className="md:w-2/3 w-4/5">
       
        
          <div className="mt-6 border-b-2 py-6">

            <div className="flex flex-col items-center">

                <span className="flex ReallyFree text-5xl text-white items-center bg-grey-lighter rounded rounded-r-none my-4 ">TOTAL NFHEROES MINTED SO FAR:  <span className="text-blau text-6xl"> {!signedIn ?  <>-</>  :  <>{totalSupply}</> } / 10,000</span></span>

                <div id="mint" className="flex justify-around  mt-8 mx-6">
                  <span className="flex ReallyFree text-5xl text-white items-center bg-grey-lighter rounded rounded-r-none px-3">Mint</span>
                  
                  <input 
                                      type="number" 
                                      min="1"
                                      max="20"
                                      value={how_many_nfheroes}
                                      onChange={ e => set_how_many_nfheroes(e.target.value) }
                                      name="" 
                                      className="ReallyFree pl-4 text-4xl  inline bg-grey-lighter  py-2 font-normal rounded text-grey-darkest  font-bold"
                                  />
                  
                  <span className="flex ReallyFree text-5xl text-white items-center bg-grey-lighter rounded rounded-r-none px-3">NFHEROES!</span>
    
                </div>
                {saleStarted ? 
                <button onClick={() => mintNFHero(how_many_nfheroes)} className="mt-4 ReallyFree text-4xl border-6 bg-blue-600 text-white hover:text-black p-2 ">MINT {how_many_nfheroes} nfheroes for {(nfheroPrice * how_many_nfheroes) / (10 ** 18)} ETH + GAS</button>        
                  : <button className="mt-4 ReallyFree text-4xl border-6 bg-blau  text-white hover:text-black p-2 ">SALE IS NOT ACTIVE OR NO WALLET IS CONNECTED</button>        
            
              }
                
            </div> 
            </div>
 
          </div>  
    </div>  
    )
  }