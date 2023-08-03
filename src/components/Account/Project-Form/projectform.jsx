import React, { useState } from "react";
import { X } from "react-feather";
import Modal from "../../Modal/modal.jsx";
import styles from "./projectform.module.css";
import Form from "../../InputForm/form.jsx";

export default function ProjectForm(props){
    // to save project details
    const [projectData, setProjectData] = useState({
        thumbnail: "",
        title: "",
        overview: "",
        github: "",
        link: "",
        points: ["", ""]
    })


    const handlePointUpdate = (value, index) => {
        const tempPoints = [...projectData.points];
        tempPoints[index] = value;
        setProjectData((prev) => ({...prev, points: tempPoints}))
    }

    const addNewPoint = () => {
        if(projectData.points.length > 2){
            return ;
        }
        setProjectData((prev) => ({...prev, points: [...projectData.points, ""]}))
    }

    const handlePointDelete = (index) => {
        const tempPoints = [...projectData.points];
        tempPoints.splice(index, 1);
        setProjectData((prev) => ({...prev, points: tempPoints}))
    }

    return (
        <Modal onclose={() => props.onClose ? props.onClose() : ""}>
            <div className={styles.container}>
                <div className={styles.inner}>
                <div className={styles.left}>
                    <div className={styles.image}>
                        <img src={projectData.thumbnail} alt="Thumbnail"/>
                        <p>
                            <span>40%</span> Uploaded
                        </p>
                    </div>

                    <Form 
                        label="Github link" 
                        value={projectData.github}
                        placeholder = "Project repository link"
                        onChange={(event) => {
                            setProjectData(prev => ({
                            ...prev,
                            github: event.currentTarget.value
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
                            link: event.currentTarget.value
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
                            title: event.currentTarget.value
                            }));
                        }}
                    />
                    <Form label="Project Overview" 
                        value={projectData.overview}
                        placeholder="Give a brief overview of the project"
                        onChange={(event) => {
                            setProjectData(prev => ({
                            ...prev,
                            overview: event.currentTarget.value
                            }));
                        }}
                    />

                    <div className={styles.description}>
                        <div className={styles.top}>
                            <p className={styles.title}>Project Description</p>
                            <p className={styles.link} onClick={addNewPoint}>+ Add Point</p>
                        </div>
                        <div className={styles.inputs}>
                        {projectData.points?.map((item, index) => (
                            <div className={styles.input}>
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
            <div className={styles.footer}>
                <p className={styles.cancel} onClick={() => props.onClose ? props.onClose() : ""}>Cancel</p>
                <button className={styles.submitButton}>Submit</button>
            </div>
        </div>
        </Modal>
    );
} 