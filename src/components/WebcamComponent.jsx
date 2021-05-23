import React, { Component, useState } from 'react';
import Webcam from "react-webcam";
import '../cameraStyles.css'
import { Style, useStates, useNamedContext } from 'react-easier';
import mongoosy from 'mongoosy/frontend';
const { User, Photo } = mongoosy;


const WebcamComponent= () => <Webcam />
  const videoConstraints = {
        width: 260,
        height: 200,
        facingMode: "user"
    };

const WebcamCapture = () => {
        const webcamRef = React.useRef(null);
        const [src,setSrc]=useState('');
        const g = useNamedContext('global');
        const s = useStates({
          imageData: '',
          display: ''
        });
        let savedPhotosSrc=[];


        const capture = React.useCallback(
            () => {
            const imageSrc = webcamRef.current.getScreenshot();
            console.log(imageSrc)
            setSrc(imageSrc)
            },
            [webcamRef],
        );

        const recapture= React.useCallback(
          
        )

        const uploadPhoto = e => {
          e.preventDefault();
          savedPhotosSrc=[...savedPhotosSrc, src.slice(5)]
          console.log(savedPhotosSrc)
        }

    
       /* const dataURItoBlob = (dataURI) => {
          let byteString = window.atob(dataURI.split(',')[1]);
          let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
          let ab = new ArrayBuffer(byteString.length);
          let ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          let blob = new Blob([ab], {type: mimeString});
          return blob;
        }
        dataURItoBlob(src),
        console.log(src)*/
        
  return (
    <div>
        <h1>take a photo</h1>
        {src==''
        ? (<Webcam
          audio={false}
          height={200}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={260}
          videoConstraints={videoConstraints}
          />)
        : (<img src={src} />)}

          {src!=''
          ?
            (<button onClick={(e)=>
            {
            e.preventDefault();
            setSrc('')
            }}
            className="webcam-btn">
            Retake Image</button>)
            :
            (<button onClick={(e)=>{
            e.preventDefault();
            capture()}}
          className="webcam-btn">Capture</button>)
          }  
        <img src={src} alt="token picture" />
        <br />
        <button onClick={uploadPhoto}>publish photo</button>
         
        <h2>Posted photos</h2>
        <div>
          {savedPhotosSrc.map((source)=>{
            <div>
              <img src={source} alt=""/>
            </div>

          })}
        </div>

    </div>)
}

export default WebcamCapture