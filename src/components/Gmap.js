import React, { useState, Fragment, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import moment from "moment";
import styled from "styled-components";
import logo from "../logo.svg";
import locations from "../data/Locations.json";
import API_KEY from "../config/api";

const containerStyle = {
  width: "700px",
  height: "700px",
};

const center = {
  lat: -32.9259518,
  lng: 151.7615659,
};

const Button = styled.button`
  /* Adapt the colors based on primary prop */
  background: ${(props) => (props.primary ? "palevioletred" : "white")};
  color: ${(props) => (props.primary ? "white" : "palevioletred")};

  font-size: 0.8em;
  margin: 0.5em;
  padding: 0.25em 1em;
  border: 1px solid palevioletred;
  border-radius: 3px;
`;

function Gmap() {
  const [map, setMap] = React.useState(null);
  const [selected, setSelected] = useState({});
  const [currentPosition, setCurrentPosition] = useState({});
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [titleName, setTitleName] = useState("No");
  const [openDays, setOpenDays] = useState([]);
  const [infoOpen, setInfoOpen] = useState(false);
  const [zoom, setZoom] = useState(5);
  const [businessDays, setBusinessDays] = useState([]);
  const [userLocations, setUserLocations] = useState([]);
  const [markerMap, setMarkerMap] = useState({});
  const [mapRef, setMapRef] = useState(null);
  const [center, setCenter] = useState({ lat: 44.076613, lng: -98.362239833 });
  const [clickedLatLng, setClickedLatLng] = useState(null);

  function makeButton(Day) {
    return (
      <Button
        onClick={() => {
          setUserLocations([]);
          locations.map((location) => {
            location.openDates.map((item) => {
              const listDate = moment(item).format("DD-MMM-YYYY");
              if (Day.value === listDate) {
                setUserLocations((prevItems) => [
                  ...prevItems,
                  {
                    id: location.length,
                    value: location,
                  },
                ]);
              }
            });
          });
        }}
      >
        {Day.value}
      </Button>
    );
  }

  const success = (position) => {
    const currentPosition = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    setCurrentPosition(currentPosition);
  };

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    locations.map((item) => {
      bounds.extend(item.position);
      return item.id;
    });
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const onSelect = (item) => {
    setSelected(item);
  };

  useEffect(() => {
    //  navigator.geolocation.getCurrentPosition(success);
    setOpenDays("");
    const setCustomerOpenDates = () => {
      locations.map((data) => {
        data.openDates.map((item) => {
          setOpenDays((prevItems) => [
            ...prevItems,
            {
              id: moment(item).format("DD-MMM-YYYY"),
              value: moment(item).format("DD-MMM-YYYY"),
            },
          ]);
        });
      });
    };
    setCustomerOpenDates();
    //  console.log(openDays);
    //  console.log(businessDays);

    // set the title with the user selected business name
    document.title = `You selected ${titleName} business`;
  }, [titleName]);

  const getOpenDays = (openDays) => {
    const businessDays = [
      ...new Map(openDays.map((o) => [o.value, o])).values(),
    ];
    businessDays.map((data) => {
      makeButton(data.value);
    });
  };

  var icon = {
    url: logo,
    //  scaledSize: new window.google.maps.Size(100, 30),
    fillOpacity: 1.0,
    strokeWeight: 0,
    scale: 0.5,
  };

  // We have to create a mapping of our places to actual Marker objects
  const markerLoadHandler = (marker, place) => {
    return setMarkerMap((prevState) => {
      return { ...prevState, [place.id]: marker };
    });
  };

  const markerClickHandler = (event, place) => {
    // Remember the place clicked
    setSelectedPlace(place);

    // Remember the title name
    setTitleName(place.value.name);

    // set info open to false if already open
    if (infoOpen) {
      setInfoOpen(false);
    }

    setInfoOpen(true);

    // If you want to zoom in a little on marker click
    if (zoom < 18 || zoom < 18) {
      setZoom(18);
    }

    // if you want to center the selected Marker
    setCenter(place.position);
  };

  return (
    <Fragment>
      <div>{openDays.map(makeButton, this)}</div>
      <LoadScript googleMapsApiKey={API_KEY}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={zoom}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={(e) => setClickedLatLng(e.latLng.toJSON())}
        >
          {userLocations.map((loc) => {
            return (
              <Marker
                icon={icon}
                key={loc.value.name}
                position={loc.value.position}
                text={loc.value.name}
                label={loc.value.name.charAt(0)}
                onLoad={(marker) => markerLoadHandler(marker, loc)}
                onClick={(event) => markerClickHandler(event, loc)}
              />
            );
          })}

          {infoOpen && selectedPlace && (
            <InfoWindow
              anchor={markerMap[selectedPlace.id]}
              onCloseClick={() => setInfoOpen(false)}
            >
              <div>
                <h3>{selectedPlace.value.name}</h3>
                <h5>{selectedPlace.value.address}</h5>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>

      {/* Business selected */}
      {selectedPlace && <h3>{selectedPlace.value.name}</h3>}
      {selectedPlace && <h5>{selectedPlace.value.address}</h5>}
      {selectedPlace && <h3>Open Days</h3>}
      {selectedPlace &&
        selectedPlace.value.openDates.map((day, index) => (
          // Only do this if items have no stable IDs
          <li key={index}>
            {moment(day).format("ddd, DD MMM YYYY HH:mm:ss [GMT]")}
          </li>
        ))}
    </Fragment>
  );
}

export default Gmap;
