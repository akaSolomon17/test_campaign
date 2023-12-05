    //check validate of email 
    export const validateEmail = (email) => {
        const re =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
      };
    
    //Check valid email and passowrd
    export function validate(email, password){
        if (!validateEmail(email)) 
        {
            alert('Invalid Email');
            return false;
        }      
        if (password.length < 8) 
        {
            alert('Password must be at least 8 chars long');
            return false;
        }
        return true;
    }

