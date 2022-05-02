import React, { useEffect, useState } from 'react'
import { Container, Form, Row, Col } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { removeAlertMessage, setErrorAlert, setSuccessAlert } from '../../../features/alertSlice';
import { axiosInstance } from '../../../AxiosSetup';
import "./ScheduleAppointments.css";
import WatchLaterIcon from '@mui/icons-material/WatchLater';

const ScheduleAppoinments = () => {
    const [date, setdate] = useState("");
    const [cmpDate, setcmpDate] = useState("");
    const [one, setone] = useState(0);
    const [two, settwo] = useState(0);
    const [three, setthree] = useState(0);
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(date, cmpDate)
        if (date < cmpDate) {
            dispatch(setErrorAlert({ errorAlert: "Selected date is inapporpriate" }));
            setTimeout(() => {
                dispatch(removeAlertMessage());
            }, 7000)
            return 
        }
        if(one<0 || two<0 || three<0){
            dispatch(setErrorAlert({ errorAlert: "Number of appointments cannot be negative" }));
            setTimeout(() => {
                dispatch(removeAlertMessage());
            }, 7000)
            return 
        }
        axiosInstance.post('/appointment/schedule', {date, one, two, three}).then(() => {
            dispatch(setSuccessAlert({successAlert: "You have successfully set your appointments"}));
            setone(0);
            settwo(0);
            setthree(0);
            setdate("");
            setTimeout(() => {
                dispatch(removeAlertMessage());
            }, 7000)
        }).catch((error) => {
            console.log(error)
            dispatch(setErrorAlert({errorAlert: "You have already scheduled an appointment for this day"}));
            setTimeout(() => {
                dispatch(removeAlertMessage());
            }, 7000)
        })
    }

    useEffect(() => {
        const today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = "0" + dd.toString()
        }
        if (mm < 10) {
            mm = "0" + mm.toString()
        }
        setcmpDate(yyyy.toString() + "-" + mm + "-" + dd)
    }, [date])
    return (
        <div className='appointment__main'>
            <Container style={{ marginTop: "30px", textAlign:"center" }}>
                <h2 style={{fontSize:"2rem", fontWeight:"700", marginBottom:"30px"}}><WatchLaterIcon style={{paddingBottom:"5px", fontSize:"2.5rem"}}/> Schedule Appointment</h2>
                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col sm={6} md={2}><Form.Label style={{fontSize:"1.2rem", fontWeight:"500"}}>Select Date</Form.Label></Col>
                        <Col sm={6} md={2}><Form.Control style={{ marginBottom: "20px", backgroundColor: "#7577F6", borderRadius: "10px", border: "1px solid #07087D", padding: "10px 15px", color: "white" }} type="date" name="date" onChange={(e) => { setdate(e.target.value) }} /></Col>
                    </Row>
                    <Row>
                        <Col sm={6} md={4}>
                            <p style={{fontSize:"1.2rem", fontWeight:"500"}}>9am - 12pm</p>
                            <Form.Control style={{ marginBottom: "20px", backgroundColor: "#7577F6", borderRadius: "10px", border: "1px solid #07087D", padding: "10px 15px", color: "white" }} value={one} onChange={(e) => { setone(e.target.value) }} type="number" />
                        </Col>
                        <Col sm={6} md={4}>
                            <p style={{fontSize:"1.2rem", fontWeight:"500"}}>1pm - 5pm</p>
                            <Form.Control style={{ marginBottom: "20px", backgroundColor: "#7577F6", borderRadius: "10px", border: "1px solid #07087D", padding: "10px 15px", color: "white" }} value={two} onChange={(e) => { settwo(e.target.value) }} type="number" />
                        </Col>
                        <Col sm={6} md={4}>
                            <p style={{fontSize:"1.2rem", fontWeight:"500"}}>6pm - 9pm</p>
                            <Form.Control style={{ marginBottom: "20px", backgroundColor: "#7577F6", borderRadius: "10px", border: "1px solid #07087D", padding: "10px 15px", color: "white" }} value={three} onChange={(e) => { setthree(e.target.value) }} type="number" />
                        </Col>
                    </Row>
                    <button className="edit__save__btn" style={{ margin: "20px 0" }} type="submit">Save</button>
                </Form>
            </Container>
        </div>
    )
}

export default ScheduleAppoinments
