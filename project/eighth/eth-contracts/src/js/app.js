
App = {
    web3Provider: null,
    contracts: {},
    emptyAddress: "0x0000000000000000000000000000000000000000",
    
    metamaskAccountID: "0x0000000000000000000000000000000000000000",
    ownerID: "0x0000000000000000000000000000000000000000",
   

    init: async function () {
        //App.readForm();
        /// Setup access to blockchain
        return await App.initWeb3();
    },

    initWeb3: async function () {
        /// Find or Inject Web3 Provider
        /// Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                // Request account access
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }

        App.getMetaskAccountID();

        return App.initMintProperty();
    },

    getMetaskAccountID: function () {
        web3 = new Web3(App.web3Provider);

        // Retrieving accounts
        web3.eth.getAccounts(function(err, res) {
            if (err) {
                console.log('Error:',err);
                return;
            }
            console.log('getMetaskID:',res);
            App.metamaskAccountID = res[0];

        })
    },

    initMintProperty: function () {
        /// Source the truffle compiled smart contracts
        var jsonVerifier='../../eth-contracts/build/contracts/SolnSquareVerifier.json';
        
        /// JSONfy the smart contracts
        $.getJSON(jsonVerifier, function(data) {
            console.log('data',data);
            var verifierArtifact = data;
            App.contracts.SolnSquareVerifier = TruffleContract(verifierArtifact);
            App.contracts.SolnSquareVerifier.setProvider(App.web3Provider);
        });

        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', App.handleButtonClick);
    },

    handleButtonClick: async function(event) {
        event.preventDefault();

        App.getMetaskAccountID();
        App.propertyID = $("#propertyid").val();
        var processId = parseInt($(event.target).data('id'));
        console.log('processId',processId);
        if(processId == 2)
        {
            return await App.mintProperty(event); 
        }

      
    },
    mintProperty:function(event){
        event.preventDefault();
        App.contracts.SolnSquareVerifier.deployed().then(function(instance) {
            return instance.mintToken(                 
                App.metamaskAccountID,
                App.propertyID,
                ValidProof.proof.A,
                ValidProof.proof.A_p,
                ValidProof.proof.B,
                ValidProof.proof.B_p,
                ValidProof.proof.C,
                ValidProof.proof.C_p,
                ValidProof.proof.H,
                ValidProof.proof.K,
                ValidProof.input
            );
        }).then(function(result) {
            $("#ftc-events").text(result.tx);
            //console.log('disinfectItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });

    }
};
let ValidProof =
    {
	"proof":
	{
		"A":["0x2a189b451e73e288d5f6c86dbfa556cad37e5e4a7cb4479b852e4ec432e7c61b", "0xa275c185b682eeabe62ccf9c2f446e998a407482e5d07c4ad181029cb002c18"],
		"A_p":["0x207579339143d407b9bf9138cd4f8f30c4c62f7c45c48be4ad7e105502e87358", "0x1d23ab4cc896553a882e74ddfa0fcf2faecfcdb02689dabb9bff5179188f37d9"],
		"B":
			[["0x11d3c4dada9829262c52769a5932a9546374030968e0e25783ff942a49b7e52d", "0x90a3e253bc3f9ab3a450732a80eb3375035a9490f23f10c879c29b5aebd00c"], ["0x250eee47596bb0e8c8dcc36a82777bf22da77f9eda822dbb82a17aa4b50ed60c", "0x1ef10e77b737ff2936a94786c2c16f75091e37852be7fec4171141d865656078"]],
		
		"B_p":["0x1302434b080c5419f935c54532fc669a82d0d6e62cf701f43b2098616fa9e7", "0x1c500522dac6e60192e2f51953b900fc5203370cdcc5bd024c82de99a1d5f8a9"],
		"C":["0x15a3b35444f01813e248197798e2750e4eeb373ed76aa0186e9ff86a9742a5f9", "0xb6ffe6061246d17cc8a9f5b4285bc80de953bc090fd1a245cf974521121365d"],
		"C_p":["0x271c39e1d18bc0c0403060f03a448384ca87e03603f0ea26f1e3275830fd78e2", "0x893e3f9d50718337b616d667bafe127453e08c93f058b939fe8cc4f2f68a0a"],
		"H":["0x1a3cd160e7754a85aa445a0e48a4508807fec5a348ae42101862b17ca17bb56f", "0x6af98329db9bebb204e7c83f0c0b2a848c6ef7b11849d86914af53083ae2dcc"],
		"K":["0x1508a404cc6987cb150240b8ebbf60e2e4a835b8cdd70eeed4e704035415dce6", "0x1fa94f79d78f4a170e8f31fb8151bfd7101b8c7d550de2652ff63242581cc47d"]
	},
	"input":[9,1]}

$(function () {
    $(window).load(function () {
        App.init();
    });
});
