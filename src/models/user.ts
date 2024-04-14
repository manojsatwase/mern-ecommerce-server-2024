import mongoose from 'mongoose';
import validator from 'validator';

// for use generic use to defined age
interface IUser extends Document {
    _id: string;
    name: string;
    email:string;
    photo:string;
    role:"admin" | "user";
    gender:"male" | "female";
    dob:Date;
    createdAt:Date;
    updatedAt:Date;
    // Virtual Attribute
    age:number
}

const userSchema = new mongoose.Schema(
    {
        // firebase google auth google uuid send from frontend
    _id: {
        type:String,
        required:[true, "Please enter ID"]
    },
    name: {
       type:String,
       required:[true, "Please enter Name"]
    },
    email: {
      type: String,
      unique:[true,"Email Already Exist"],
      required:[true,"Please enter Email"],
      // custom validator
      /*
      validate: function(email:string){
        const emailPattern =
        /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailPattern.test(email);
      }
      */
     validate:validator.default.isEmail
    },
    photo: {
     type: String,
     required: [true, "Please add Photo"]
    },
    role: {
      type: String,
      enum:["admin","user"],
      default:"user"
    },
     gender: {
      type:String,
      enum:["male","female"],
      required:[true,"Please enter Gender"]
    },
    dob: {
        type:Date,
        required:[true, "Please entr Date of birth"]
    }
    
  },{
    timestamps:true
  }
)

userSchema.virtual('age').get(function(this: { dob: Date }){
   const today = new Date();
   const dob = this.dob;
   let age = today.getFullYear() - dob.getFullYear();
     // eg april       july  month is coming age kam kar denge
   if(today.getMonth() < dob.getMonth() || today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate() ){
    age--;
   }

   return age;
})

export const User = mongoose.model<IUser>('User',userSchema);