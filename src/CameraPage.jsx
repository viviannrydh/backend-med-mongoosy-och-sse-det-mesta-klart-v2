import React from 'react'
import WebcamCapture from './components/WebcamComponent'
//import ReactCameraComponent from './components/ReactCameraComponent'

const Camera = () => {
    return (
        <>
        <form>
            
            <WebcamCapture />
            <br />
            <span>Created by: Viviann</span>
            <br />
            <label>Tags:</label>
            <select>
              <option value="nature">nature</option>
              <option value="art">art</option>
              <option value="art">art</option>
              <option value="art">art</option>
            </select>
            <br />
            <label>Description</label>
            <textarea name="description" id="" cols="30" rows="10"></textarea>    
        </form>
        </>
    )
}

export default Camera
