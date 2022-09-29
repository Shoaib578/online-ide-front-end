import React from 'react'
import uuid from 'react-uuid';
import Axios from 'axios'
import url from './base_url';
import './styles/style.css'





export default class App extends React.Component{
  state = {
    language:"",
    default_code_text:"",
    filename:"",
    code_error:[],
    output:[]
   
  }


  generate_code_file = ()=>{
    if(this.state.language != "bash"){
      let formData = new FormData()
      formData.append("filename",this.state.filename)
    
  
      formData.append("language",this.state.language)
      formData.append("code",this.state.default_code_text)
      Axios.post(url+'/apis/code/generate_file',formData)
      .then(res=>{
      console.log(res)
      console.log(this.state.filename)
  
      })
      .catch(err=>{
        console.log(err)
      })
    }
    
  }


  runing_command = ()=>{
    if(this.state.language == "javascript"){
      return "node"
    }else if(this.state.language == "c"){
      return "gcc"
    }else if(this.state.language == "ruby"){
      return "ruby"
    }else if(this.state.language == "java"){
      return "java"
    }else if(this.state.language == "bash"){
      return "bash"
    }
  }
  run_generated_file = ()=>{
    
    
   
    let command = this.runing_command()
    console.log(command)

    if(this.state.language != "bash"){
      Axios.get(url+`/apis/code/run_code?code_file=public/code_files/${this.state.filename}&&language=${command}`)
      .then(res=>{
        console.log(res.data)
  
        this.setState({output:res.data.output,code_error:res.data.error})
        
      
      
  
  
       
      })
      .catch(err=>{
        console.log(err)
      })
    }else{
      Axios.get(url+`/apis/code/run_code?code_file=public/code_files/${this.state.filename}&&language=${command}&&code=${this.state.default_code_text}`)
      .then(res=>{
        console.log(res.data)
  
        this.setState({output:res.data.output,code_error:res.data.error})
        
      
      
  
  
       
      })
      .catch(err=>{
        console.log(err)
      })
    }
   

  }

  excute_code = ()=>{

    if(this.state.language == 0){
      
      alert("Please pick the language")
      return false
     
    }else{

    this.generate_code_file()
    setTimeout(()=>{
      this.run_generated_file()

    },300)
    }
  }


  default_code = ()=>{
    if(this.state.language == "javascript"){
      
      this.setState({default_code_text:"console.log('hello world');",filename:uuid().concat(".js")})

    }else if(this.state.language == "java"){
        this.setState({default_code_text:`
        class Main {
          public static void main(String []args) {
            System.out.println("Hello World"); 
          }
        }
       `,filename:uuid().concat(".java")})

    }else if(this.state.language == "ruby"){
     
      this.setState({default_code_text:'puts "Hello World"',filename:uuid().concat(".rb")})
      
    }else if(this.state.language == 'c'){
      this.setState({default_code_text:`#include <stdio.h>
      int main() {
         // printf() displays the string inside quotation
         printf("Hello, World!");
         return 0;
      }`,filename:uuid().concat(".c")})
    }else if(this.state.language == "bash"){
      

      this.setState({default_code_text:'echo "Hello World"',filename:uuid().concat(".sh")})
    }else{
      this.setState({default_code_text:""})
    }
  }

  componentDidMount(){
    this.setState({filename:uuid()})

  }

  render(){
    return <div >


      <div className='top_nav'>

        <select onChange={(val)=>{
          this.setState({language:val.target.value},()=>{
            this.default_code()
    

          })

         

        }} className='form-control pick_lang'>

          <option value={""}>Pick Language</option>
          <option value={"javascript"}>Javascript</option>
          <option value={"java"}> Java</option>
          <option value={"ruby"}>Ruby</option>
          <option value={"c"}>C</option>
          <option value={"bash"}>Bash</option>

        </select>

      <button onClick={this.excute_code} className='btn btn-primary run_button' >Run</button>
      
      </div>
        <br />
       


        <div className='write_code' >

      <textarea className='form-control write_code_field' onChange={(val)=>{
        this.setState({default_code_text:val.target.value})
      }} value={this.state.default_code_text}  placeholder='Write Code here...'>
     
      </textarea>



      </div>


      <div className='output'>

        <textarea  value={this.state.output.map(data=>{
          return  `> ${data}`
        })} className='result' placeholder='Output'>

       
        </textarea>
        

        <textarea placeholder='Error' value={this.state.code_error.map(data=>{
         return  data
        })} className="error ">
        
        
        </textarea>
       
      </div>


    </div>
  }
}