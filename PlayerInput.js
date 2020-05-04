class PlayerInput{


    constructor(){
        if(PlayerInput.registered){
            return input;
        }

        this.keysDown = [];

        document.addEventListener('keydown', (event)=>{

            let keyChar = String.fromCharCode(event.keyCode);
            if(this.keysDown.indexOf(keyChar) === -1){

                this.keysDown.push(keyChar);
            }


        });

        document.addEventListener('keyup', (event)=>{

            let keyChar = String.fromCharCode(event.keyCode);

            if(this.keysDown.indexOf(keyChar) > -1){

                this.keysDown.splice(this.keysDown.indexOf(keyChar),1);
            }


        })

    }
}

const input = new PlayerInput();

PlayerInput.registered = true;
