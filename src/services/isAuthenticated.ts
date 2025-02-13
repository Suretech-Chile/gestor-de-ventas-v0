export const isAuthenticated = () => 
{
    if (sessionStorage.getItem("token")) {
        //Acá debería irse a ver al backend que el token sea el correcto
        return true
    }
    else {
        return false
    }
};
export default isAuthenticated