// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage"
import API_KEY from "./apikey.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: "project-manager-1bd2d.firebaseapp.com",
  projectId: "project-manager-1bd2d",
  storageBucket: "project-manager-1bd2d.appspot.com",
  messagingSenderId: "740484992334",
  appId: "1:740484992334:web:33fe6499c22d96cb69621f",
  measurementId: "G-6817F47SHG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

// saving a new user in the db after successful signup
const updateUserDb = async (user, uid) => {
  if(typeof user !== "object"){
    return ;
  }
  const docRef = doc(db, "users", uid);
  await setDoc(docRef, {...user});
};

// retriving user data from db
const getUserDb = async (uid) => {
  const docRef = doc(db, "users", uid);
  const result = await getDoc(docRef);
  // if the user doesn't exist in the db
  if(!result.exists()){
    return null;
  }
  return result.data();
};

// storing and retriving user image 
const storage = getStorage(app);

// uploading user image on cloud
// also showing the status of the upload 
// if any issue arises then this function will handle it
// this function will also provide a link to store it in storage function
const uploadImage = (file, progress, downloadUrl, error) => {
  if(!file){
    error("File not found!");
    return ;
  }

  // file description 
  const fileType = file.type;
  const fileSize = file.size/1024/1024;
  // if any thing other than image is uploaded
  if(!fileType.includes("image")){
    error("File must an image");
    return;
  }

  if(fileSize > 2) {
    errorCallback("File must smaller than 2MB");
    return;
  }

  const storageRef = ref(storage, `images/${file.name}`)
}

export { app as default, auth, db, updateUserDb, getUserDb };