import './App.css';
import { db } from './lib/firebase';

function App() {


  db.collection('places')
  .where('status', '==', 1)
  .get()
  .then(function(querySnapshot) {
      querySnapshot.forEach(function(doc) {

          let place = doc.data();
          console.log(place);
      });
      
  })
  .catch(error => {
      //Nothing found
      this.setState({markers:[]});
      //Show message popup
      console.log('Error - ' + error.message);
    })



  return (
    <div className="App">
      Hello.
    </div>
  );
}

export default App;
