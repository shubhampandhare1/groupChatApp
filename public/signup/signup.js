function signup(event){
    event.preventDefault();

    const user = {
        name: event.target.name.value,
        email: event.target.email.value,
        mobile: event.target.mobile.value,
        password: event.target.password.value,
    }
    
}