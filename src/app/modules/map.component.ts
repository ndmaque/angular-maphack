import { Component, Input, OnInit, Inject, Renderer2 } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
declare const google;

@Component({
  selector: 'map',
  templateUrl: 'map.component.html',
  styleUrls: ['map.component.css']
})
export class MapComponent implements OnInit {
  @Input() name: string;

  formA = new FormControl('');


  //mapKey : string;
  //defaultDomain: string;
  domainName = 'https://ukvcas.co.uk/locations';
  postcodes : Array <string> = ['B3 3HN','WV1 3AX', 'S1 2BJ'];
  searchStr : string;
  targets: Array<any>;
  messages: Array<any> = [];
  selectedTarget: any;
 // powers = ['Really Smart', 'Super Flexible', 'Super Hot', 'Weather Changer'];
 // map: any;
  //p: number;

  constructor(@Inject(DOCUMENT) private document: Document,
    private renderer2: Renderer2,
  ) {}


  ngOnInit(){
    this.targets = [{
      domain: 'ukvcas.co.uk',
      mapPage: 'https://www.ukvcas.co.uk/locations/',
      key: 'AIzaSyBmLVuHdy3sHjvgQhpONIGBKnOJxJ61pG4',
      loadCount: 0,
      searchCount: 0,
      streetCount: 0,
    },
    {
      domain: 'glocalabel.com',
      mapPage: 'https://glocalabel.com/network/277-mango-address/nottingham/',
      key: 'AIzaSyD71mrVh9a-roZod7GUgunAldeTDxPU1Ao',
      loadCount: 0,
      searchCount: 0,
      streetCount: 0,
    },
    {
      domain: 'developers.google.com',
      mapPage: 'https://developers.google.com/maps/documentation/javascript/examples/places-placeid-geocoder',
      key: 'AIzaSyBIwzALxUPNbatRBj3Xi1Uhp0fFzwWNBkE',
      loadCount: 0,
      searchCount: 0,
      streetCount: 0,
    }]
  };

  profileForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    target: new FormControl(''),
  });

// start after the domain drop down action
  public selectTarget() {
    console.log('selectTarget', this.profileForm.value.target);
    if(this.profileForm.value.target) { 
      this.selectedTarget = this.targets.find(t => t.domain === this.profileForm.value.target);
      console.log('selected', this.selectedTarget);
      this.messages.push({title:'selectedTarget', text: this.selectedTarget.domain})
    } else {
      delete this.selectedTarget ;
    }

  }

  loadMap() {
    const url = 'https://maps.googleapis.com/maps/api/js?key=' + this.selectedTarget.key;
    this.loadScript(url).then(() => {
      this.initMap();
      this.selectedTarget.loadCount ++;
      this.messages.push({title:'loadMap', text:'map loaded'})
    });
  }

  private loadScript(url) {

    this.document.querySelector('#mapScripts').innerHTML = null;

    return new Promise((resolve, reject) => {
      const script = this.renderer2.createElement('script');
      script.type = 'text/javascript';
      script.src = url;
       script.text = ``;
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = reject;
      this.renderer2.appendChild(this.document.getElementById('mapScripts'), script);
    })
  }

  public initMap() {
   const map = new google.maps.Map(document.getElementById("map2"), {
    zoom: 8,
    center: { lat: -34.397, lng: 150.644 },
    });
    this.messages.push({title: 'initMap', text: 'map loaded'})
  }

geocodeAddress(geocoder, resultsMap) {

  this.messages.push({title: 'geocodeAddress', text: 'Search: ' + this.searchStr});

  geocoder.geocode({ address: this.searchStr }, (results, status) => {
    
    if (status === "OK") {
      this.messages.push({title: 'geocodeAddress',  text: 'Found: ' +results[0].formatted_address});
      
      resultsMap.setCenter(results[0].geometry.location);
      new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location,
      });

    } else {
      this.messages.push({title: 'geocodeAddress',  text: 'Error: ' + status});
    }
  });
  
}


sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

mapLoop()  {
  const geocoder = new google.maps.Geocoder();
  const map = new google.maps.Map(document.getElementById("map2"), {
    zoom: 6,
    center: { lat: -34.397, lng: 150.644 },
    });

  for ( const p in this.postcodes) {
    let x = Number(p) * 2000;
    this.sleep( x ).then(() => { 
      console.log("code", x, this.postcodes[p]);
      //let event = new Event('input', { bubbles: true }); 
      this.searchStr = '' + this.postcodes[p] + ', UK';
      this.geocodeAddress(geocoder, map) 

    });
  }
}

test() {
  console.log('test');
  this.mapLoop();
}

  /*
  staticMapString = `
  //center=Brooklyn+Bridge, New+York, NY
  &zoom=12
  &size=300x300
  &maptype=roadmap
  &markers=color:blue%7Clabel:S%7C40.702147,-74.015794
  &markers=color:green%7Clabel:G%7C40.711614,-74.012318
  &markers=color:red%7Clabel:C%7C40.718217,-73.998284
  &key=` + this.getApiKey();
  */


  /*
        //document.querySelectorAll('[formcontrolname = "postcode"]')[0].value = postcodes[p];
      //document.querySelectorAll('[formcontrolname = "postcode"]')[0].dispatchEvent(event);
      //btn.;



      =============
          //const geocoder = new google.maps.Geocoder();
   // document.getElementById("submit").addEventListener("click", () => {
    //  this.geocodeAddress(geocoder, map);
   // });
    // console.log('search', x)

  */
}