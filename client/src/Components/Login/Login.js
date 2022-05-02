import React, { useState } from 'react';
import { Button, Modal, Form, Alert } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; 
import { setActiveUser } from '../../features/userSlice';
import { setSuccessAlert, setErrorAlert, getErrorAlert, removeAlertMessage } from '../../features/alertSlice';
import { axiosInstance } from '../../AxiosSetup';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import './Login.css';

const Login = ({ history }) => {
    const dispatch = useDispatch();
    const location = useLocation();

    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [role, setrole] = useState("");

    const errorMessage = useSelector(getErrorAlert);

    const [show, setShow] = useState(new URLSearchParams(location.search).get('show'));

    const handleClose = () => {
        setShow(false);
        history.push("/");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if(!role){
            return setErrorAlert({errorAlert: "You have not selected a type"})
        }
        axiosInstance.post('/auth/login', { email, password, role }).then(() => {
            setShow(false);
            dispatch(setActiveUser({
                email: email,
                userType: role
            }));
            dispatch(setSuccessAlert({ successAlert: "You have successfully logged in!" }));
            setTimeout(() => {
                dispatch(removeAlertMessage())
            }, 7000)
            if(role==="doctor"){
                history.push("/doctor/edit");
            }else{
                history.push("/home");
            }
        }).catch((error) => {
            console.log(error)
            dispatch(setErrorAlert({ errorAlert: "There was some error. Please login again" }));
            setTimeout(() => {
                dispatch(removeAlertMessage())
            }, 7000)
            // seterror(error)
        })
    }

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                {errorMessage && <Alert variant="danger" onClose={() => dispatch(removeAlertMessage())} dismissible>{errorMessage}</Alert>}
                <Modal.Header closeButton style={{backgroundColor:"rgb(249 246 246);"}}>
                    <Modal.Title className="login__title"><LockOpenIcon style={{fontSize:"2rem", color:"#07087D", paddingBottom:"5px"}} />LOGIN</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Control style={{marginBottom: "10px", padding:"10px 20px", borderRadius:"25px"}} type="email" placeholder="Enter Email" name="email" value={email} onChange={(e) => { setemail(e.target.value) }} />
                        <Form.Control style={{marginBottom: "10px", padding:"10px 20px", borderRadius:"25px"}} type="password" placeholder="Enter Password" name="password" value={password} onChange={(e) => { setpassword(e.target.value) }} />
                        <div>
                            <Form.Check style={{marginBottom: "5px", fontWeight:"700"}} name="user-type" value="patient" onChange={() => {setrole("patient")}} defaultchecked type="radio" label="Patient" />
                            <Form.Check style={{marginBottom: "5px", fontWeight:"700"}} name="user-type" value="doctor" onChange={() => {setrole("doctor")}} type="radio" label="Doctor" />
                        </div>
                        <Button className="login__btn" style={{backgroundColor: "#07087D", padding: "10px 100px", marginLeft: "100px" }} type="submit">Login</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default Login;