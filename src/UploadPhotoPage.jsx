import React, { useEffect } from 'react';
import { Style, useStates, useNamedContext } from 'react-easier';
import mongoosy from 'mongoosy/frontend';
const { User, Photo } = mongoosy;

const UploadPhoto = () => {
    const g = useNamedContext('global');

    const s = useStates({
      imageData: '',
      display: ''
    });
    const photoChosen = () => {
        let file = document.forms.photoUpload.file.files[0];
        if (!file) { return; }
        // convert the file data to a base64-encoded url
        // used for preview and also for saving the photo later
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          s.imageData = reader.result;
        }, false);
        reader.readAsDataURL(file);
      }
    
      // upload photo
      const uploadPhoto = async e => {
        e.preventDefault();
        // If no photo chosen do nothing
        if (!s.imageData) { return; }
        // Create a new Photo
        let photo = new Photo({
          // (we are not using tag and description fields yet)
          author: g.user._id,
          url: s.imageData
        });
        await photo.save();

        g.photos=[...g.photos,photo]
      }
    return (
        <div>
            <h2>Upload photo</h2>
            <form name="photoUpload" onSubmit={uploadPhoto}>
                <input name="file" type="file"
                    accept="image/*" onChange={photoChosen} />
                {s.imageData && <img src={s.imageData} width="300" />}
                <input type="submit" value="Publish photo" />
            </form>
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
            
           
            <hr />
            <h2>All photos</h2>
            {  
              g.photos.map(photo => <div key={photo.url}>
            <img src={'/uploads/' + photo.url} style={{width:'85%'}}/>
            <p>By: {photo.author.name}</p>
            </div>)}

        </div>
    )
}

export default UploadPhoto
