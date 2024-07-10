<script lang="ts">
    import {PrivateKey} from '@bsv/sdk'

    let WIF:String
    let address:String

    function createkeys () {
        const prikey = PrivateKey.fromRandom()
        WIF =prikey.toWif()
        console.log("Privatekey WIF format is ",WIF)
        address = prikey.toAddress()
        console.log("Your bitcoin address is",address)   
        }
</script>
<section>
    <button class="bg-black text-white p-2 rounded mx-auto"on:click={createkeys}>
        generate new Wallet keys
    </button>
    <p>private key WIF format is : {WIF}</p>
    <p>yout Bitcoin Address is : {address}</p>
</section>