import './App.css';
import Table from './Table';
import { useFormik } from 'formik';
import axios from 'axios';
import { useState, useEffect} from 'react';

function App() {
  
  const [users, setUsers] = useState([]);
  const [isEditing , setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState([]);


  let fetchData = async () => {
    try{

      let result =  await axios.get('http://localhost:4000/students')
      // console.log(result.data);
      setUsers(result.data);

    }
    catch(error){
      console.log(error);
    }
   
  }

  // fetchData();

  useEffect(() => {
    fetchData();
  
    
  }, [])
  

 


  let formik = useFormik({
    initialValues : {
      email:'',
      password:'',
    },

    onSubmit: async (values) =>{
      try{
        if(!isEditing){

        await axios.post('http://localhost:4000/students',values);
        fetchData()
        }
        else {
          delete values._id
          await axios.put(`http://localhost:4000/students/${currentUser._id}`,values);
        fetchData()
          setIsEditing(false);
        }
    
      }
      catch(error){
        console.log(error);
      }

     
    }
  });
  // console.log(users)

  const handleEdit = async(id) => {
    try{
      let students = await axios.get(`http://localhost:4000/students/${id}`);
      formik.setValues(students.data);
      setIsEditing(true);
      setCurrentUser(students.data);

    }
    catch(error){
      console.log(error);
    }
  }

  const handleDelete = async(id) => {
    try{
          await axios.delete(`http://localhost:4000/students/${id}`)
          fetchData()
    }
    catch(error){
     console.log(error);
    }
  }
   

  return (

    <div className="container">
 <div className='row'>
  <div className='col-lg-6'>

  <form onSubmit={formik.handleSubmit}>
  <div className="form-group my-1">
    <label htmlFor="exampleInputEmail1">Email address</label>
    <input type="text" className="form-control"  placeholder="Enter email"  name="email"
         onChange={formik.handleChange}
         value={formik.values.email}/>
  </div>
  <div className="form-group my-1">
    <label htmlFor="exampleInputPassword1">Password</label>
    <input type="text" className="form-control"  placeholder="Password"  name="password"
        onChange={formik.handleChange}
        value={formik.values.password} />
  </div>
  <input type="submit" value='Submit' className="btn btn-primary my-1"/>
</form>




  </div>
  <div className='col-lg-6'>

  <table className="table">
  <thead>
    <tr>
      <th scope="col">id</th>
      <th scope="col">UserName</th>
      <th scope="col">Pasword</th>
      <th scope="col">Actions</th>
     
    </tr>
  </thead>
  <tbody>
    {
      users.map((user,index) => {
        return (
          <tr key={index}>
           
            <th scope="row">{user._id}</th>
            <td>{user.email}</td>
            <td>{user.password}</td>
            <td>
              <button  className="btn btn-primary btn-sm my-1 mx-1" onClick={()=>handleEdit(user._id)}>Edit</button>
              <button  className="btn btn-danger btn-sm mx-1 my-1" onClick={()=>handleDelete(user._id)}>Delete</button>
            
            </td>
          </tr>
        )
      })
    }
    
   
  </tbody>
</table>



  </div>
  </div> 



    </div>
  );
}

export default App;
