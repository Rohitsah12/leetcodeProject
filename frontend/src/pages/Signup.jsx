
// import { useState } from "react";
import { useForm } from "react-hook-form"

function Signup(){
    const {register,handleSubmit,formState: { errors },} = useForm();
    return(
        <form onSubmit={handleSubmit((data) => console.log(data))}>
            <input {...register('firstName')} 
                placeholder="Enter name"
            />
            <input {...register('email')} 
                placeholder="Enter email"
            />
            <input {...register('password')}
            placeholder="Enter Password" />
            
            <button type="submit" className="btn btn-lg">Submit</button>
        </form>
    )

}

export default Signup;



// function Signup(){
//     const [name,setName]=useState('');
//     const [email,setEmail]=useState('');
//     const [password,setPassword]=useState('');

//     const handleSubmit=(e)=>{
//         e.preventDefault();
//     }
//     return(
//         <form onSubmit={handleSubmit} className="min-h-screen flex flex-col justify-center items-center gap-y-2">
//             <input type="text" value={name} placeholder="Enter your name" onChange={(e)=>setName(e.target.value)}></input>
//             <input type="email" value={email} placeholder="Enter your email" onChange={(e)=>setEmail(e.target.value)}></input>
//             <input type="password" value={password} placeholder="Enter your password" onChange={(e)=>setPassword(e.target.value)}></input>
//             <button type="submit">Submit</button>
//         </form>
//     )
// }