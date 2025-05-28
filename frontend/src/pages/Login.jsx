import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { loginUser } from '../authSlice';

const signupSchema = z.object({
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password is to weak")
});

function Login() {
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const {isAuthenticated,loading,error}=useSelector((state)=>state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });
  useEffect(()=>{
    if(isAuthenticated){
      navigate('/');
    }
  },[isAuthenticated,navigate])

  const onSubmit = (data) => {
    dispatch(loginUser(data));

    // Backend data ko send kar dena chaiye?
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"> {/* Centering container */}
      <div className="card w-96 bg-base-100 shadow-xl"> {/* Existing card styling */}
        <div className="card-body">
          <h2 className="card-title justify-center text-3xl">Leetcode</h2> {/* Centered title */}
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Existing form fields */}
            <div className="form-control  mt-4">
              <label className="label mb-1">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                className={`input input-bordered ${errors.emailId && 'input-error'}`}
                {...register('emailId')}
              />
              {errors.emailId && (
                <span className="text-error">{errors.emailId.message}</span>
              )}
            </div>

            <div className="form-control mt-4">
              <label className="label mb-1">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className={`input input-bordered ${errors.password && 'input-error'}`}
                {...register('password')}
              />
              {errors.password && (
                <span className="text-error">{errors.password.message}</span>
              )}
            </div>

            <div className="form-control mt-6 flex justify-center">
              <button
                type="submit"
                className="btn btn-primary"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;



// const errors={
//     firstName:{
//         type:'minLength',
//         message:"Minimum character should be 3 "// custom error message
//     },
//     emailId:{
//         type:'invalid_string',
//         message:'Invalid Email'
//     }
// }


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