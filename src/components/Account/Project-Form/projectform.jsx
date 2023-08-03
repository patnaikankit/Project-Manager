import React, { useRef, useState } from "react";
import { X } from "react-feather";
import Modal from "../../Modal/modal.jsx";
import styles from "./projectform.module.css";
import Form from "../../InputForm/form.jsx";
import { uploadImage, addProjectDb } from "../../../firebase.js";

export default function ProjectForm(props){
    const fileTypeInput = useRef();

    // to save project details
    const [projectData, setProjectData] = useState({
        thumbnail: "",
        title: "",
        overview: "",
        github: "",
        link: "",
        // input for atleast two points for description is already provided with the choice to adding extra points 
        points: ["", ""]
    })

    // to display any error which may arise in the project form
    const [errMsg, setErrMsg] = useState("");

    // to signify that the download has started 
    const [uploadStart, setUploadStart] = useState(false);

    // to show the status of the image upload
    const [progress, setProgress] = useState(0);

    // to disable the submit button after successful submission
    const [submitButtonDisable, setSubmitButtonDisable] = useState(false);


    // to display all the points in the order they were provided
    const handlePointUpdate = (value, index) => {
        const tempPoints = [...projectData.points];
        tempPoints[index] = value;
        setProjectData((prev) => ({...prev, points: tempPoints}))
    }

    // to add another point in the description
    const addNewPoint = () => {
        // the user can't add more than 3 points 
        if(projectData.points.length > 2){
            return ;
        }
        setProjectData((prev) => ({...prev, points: [...projectData.points, ""]}))
    }

    // to delete a point in the description
    const handlePointDelete = (index) => {
        const tempPoints = [...projectData.points];
        tempPoints.splice(index, 1);
        setProjectData((prev) => ({...prev, points: tempPoints}))
    }

    // to let users upload an image
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if(!file){
            return ;
        }
        setUploadStart(true);

        // the same workflow will be used as that of profile image upload
        uploadImage(file, 
                    (progress) => {
                        setProgress(progress);
                    }, 
                    (url) => {
                        setUploadStart(false);
                        setProgress(0);
                        setProjectData((prev) => ({...prev, thumbnail: url}));
                    }, 
                    (error) => {
                        setUploadStart(false);
                        setErrMsg(error)
                    }
                )
    }

    // to validate the user input before uploading it in the db
    const validateData = () => {
        const actualPoints = projectData.points.filter((item) => item.trim());

        let isValid = true;
        if(!projectData.thumbnail){
            isValid = false;
            setErrMsg("Thumbnail for project is required");
          } 
          else if(!projectData.github){
            isValid = false;
            setErrMsg("Project's repository link required");
          } 
          else if(!projectData.title){
            isValid = false;
            setErrMsg("Project's Title required");
          } 
          else if(!projectData.overview){
            isValid = false;
            setErrMsg("Project's Overview required");
          } 
          else if(!actualPoints.length){
            isValid = false;
            setErrMsg("Description of Project is required");
          } 
          else if(actualPoints.length < 2){
            isValid = false;
            setErrMsg("Minimum 2 description points required");
          } 
          else{
            setErrMsg("");
          }
          return isValid;
    }

    // submitting user data and uploading it in the db
    const handleSubmit = async () => {
        if(!validateData()){
            return ;
        }
        setSubmitButtonDisable(true);
        await addProjectDb({...projectData, refUser: props.uid});
        setSubmitButtonDisable(false);
        if(props.onClose){
            props.onClose();
        }
    }

    return (
        <Modal onclose={() => props.onClose ? props.onClose() : ""}>
            <div className={styles.container}>
            <input type="file" 
                   style={{display: "none"}}
                   ref={fileTypeInput}
                   onChange={handleImageUpload}
                />
                <div className={styles.inner}>
                <div className={styles.left}>
                    <div className={styles.image}>
                        <img src={projectData.thumbnail || "https://www.agora-gallery.com/advice/wp-content/uploads/2015/10/image-placeholder-300x200.png"} 
                             alt="Thumbnail"
                             onClick={() => {fileTypeInput.current.click()}}   
                             />
                            {
                                uploadStart && (<p>
                                    <span>{progress.toFixed(2)}%</span> Uploaded
                                </p>)
                            }
                    </div>

                    <Form 
                        label="Github link" 
                        value={projectData.github}
                        placeholder = "Project repository link"
                        onChange={(event) => {
                            setProjectData(prev => ({
                            ...prev,
                            github: event.target.value
                            }));
                        }}
                        />
                    <Form 
                        label="Deployed link"
                        value={projectData.link}
                        placeholder = "Project Deployed link"
                        onChange={(event) => {
                            setProjectData(prev => ({
                            ...prev,
                            link: event.target.value
                            }));
                        }}
                        />
                </div>
                <div className={styles.right}>
                    <Form label="Project Title" 
                        placeholder="Enter project's title"
                        value={projectData.title}
                        onChange={(event) => {
                            setProjectData(prev => ({
                            ...prev,
                            title: event.target.value
                            }));
                        }}
                    />
                    <Form label="Project Overview" 
                        value={projectData.overview}
                        placeholder="Give a brief overview of the project"
                        onChange={(event) => {
                            setProjectData(prev => ({
                            ...prev,
                            overview: event.target.value
                            }));
                        }}
                    />

                    <div className={styles.description}>
                        <div className={styles.top}>
                            <p className={styles.title}>Project Description</p>
                            <p className={styles.link} onClick={addNewPoint}>+ Add Point</p>
                        </div>
                        <div className={styles.inputs}>
                        {projectData.points.map((item, index) => (
                            <div className={styles.input} key={index}>
                                <Form key={item} 
                                      value={item}
                                      onChange={(event) =>
                                        handlePointUpdate(event.target.value, index)
                                      }
                                />
                                {index > 1 && <X onClick={() => handlePointDelete(index)} />}
                                </div>
                            ))}
                            </div>    
                        </div>
                </div>
            </div>
            <p className={styles.error}>{errMsg}</p>
            <div className={styles.footer}>
                <p className={styles.cancel} onClick={() => props.onClose ? props.onClose() : ""}>Cancel</p>
                <button className={styles.submitButton} onClick={handleSubmit} disabled={submitButtonDisable}>Submit</button>
            </div>
        </div>
        </Modal>
    );
} 