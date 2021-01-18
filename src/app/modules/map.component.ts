import { Component, Input, OnInit, Inject, Renderer2 } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


declare const google;

@Component({
  selector: 'map',
  templateUrl: 'map.component.html',
  styleUrls: ['map.component.css']
})
export class MapComponent implements OnInit {
  @Input() name: string;

  constructor(
    @Inject(DOCUMENT) 
    private document: Document,
    private renderer2: Renderer2,
    public sanitizer: DomSanitizer
  ) {};

 // domainName = 'https://ukvcas.co.uk/locations';
  postcodes : Array <string> = ['PL17 0AE','WV1 3AX','BN1 1AE', 'S1 2BJ', 'EH1 1AD', 'BT1 1AA','B3 3HN'];
  searchStr : string;
  targets: Array<any>;
  messages: Array<any> = [];
  logMsg: string;
  selectedTarget: any;
  showHide = {map: false, iframe: false, static: false };
  mapCentre = { lat: 53.397, lng: -1.644 };
  




  ngOnInit(){
    console.log ('show', this.showHide);
    this.messages = [];
    this.targets = [
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

  form = new FormGroup({
    domain: new FormControl(''),
    target: new FormControl(''),
    mapPage: new FormControl(''),
    key: new FormControl(''),
  });

// start after the domain drop down action
  public selectTarget() {
    console.log('profileForm', this.form.value.target);
    if(this.form.value.target) { 
      this.selectedTarget = this.targets.find(t => t.domain === this.form.value.target);
    //  console.log('selected', this.selectedTarget);
      this.messages.push({title:'selectedTarget', text: this.selectedTarget.domain});
    this.form.controls.key.reset(this.selectedTarget.key, true)  ;
    this.form.controls.domain.reset(this.selectedTarget.domain, true)  ;
    this.form.controls.mapPage.reset(this.selectedTarget.mapPage, true)  ;

      //
    } else {
      this.selectedTarget = null;
    }

  };

  lastMessages() {
    return this.messages.reverse()
  }

  getIframeUrl() {
// ss
 return this.sanitizer.bypassSecurityTrustResourceUrl(this.form.value.mapPage);
  }

  loadMap() {
    const url = 'https://maps.googleapis.com/maps/api/js?key=' + this.form.value.key;
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
    zoom: 5,
    center: this.mapCentre,
    });
    this.messages.push({title: 'initMap', text: 'map loaded'})
  }

msgLog(msg) {
  this.logMsg = msg;
}

geocodeAddress(geocoder, resultsMap) {

 // this.messages.push({title: 'geocodeAddress', text: 'Search: ' + this.searchStr});
  this.msgLog('Address search: ' + this.searchStr);

  geocoder.geocode({ address: this.searchStr }, (results, status) => {
    
    if (status === "OK") {
      this.selectedTarget.searchCount++;
      //this.messages.push({title: 'geocodeAddress',  text: 'Found: ' +results[0].formatted_address});
      this.msgLog('Google $Search Found: ' + results[0].formatted_address);
      
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

mapSearch()  {
  const geocoder = new google.maps.Geocoder();
  const map = new google.maps.Map(document.getElementById("map2"), {
    zoom: 6,
    center: this.mapCentre,
  });

  //let x = new google.maps.LatLng(53.0,-1.0);
  //console.log();

  this.selectedTarget.loadCount++;

  for ( const p in this.postcodes) {
    let x = Number(p) * 2000;
    this.sleep( x ).then(() => { 
      console.log("code", x, this.postcodes[p]);
      //let event = new Event('input', { bubbles: true }); 
      this.searchStr = '' + this.postcodes[p] + ', UK';
      this.geocodeAddress(geocoder, map) 

      //map.setCenter(new google.maps.LatLng(53.0,-1.0));
    });
      map.setZoom(4);
  map.setCenter( this.mapCentre);
  }



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