import axios from 'axios';
import history from '../history';
import { toast } from 'react-toastify';
import '!style-loader!css-loader!react-toastify/dist/ReactToastify.css';

//ACTION TYPES
const GET_LOCATIONS = 'GET_LOCATIONS';

const GET_LOCATION = 'GET_LOCATION';
const ADD_NEW_LOCATION = 'ADD_NEW_LOCATION';
const UPDATE_LOCATION = 'UPDATE_LOCATION';
const ADD_REVIEW = 'ADD_REVIEW';

//INITIAL STATE
const defaultLocations = [];

//INITIAL STATE
const initialState = {
	locations: [],
	selectedLocation: {},
	content: '',
	reviews: []
};

//ACTION CREATORS
const getLocations = (locations) => ({ type: GET_LOCATIONS, locations });
const getLocation = (location) => ({ type: GET_LOCATION, location });
const addNewLocation = (location) => ({ type: ADD_NEW_LOCATION, location });
const updateExistingLocation = (location) => ({ type: UPDATE_LOCATION, location });
const addNewReview = (content) => ({ type: ADD_REVIEW, content });
const getReviews = () => ({ type: GET_REVIEWS });

//THUNK CREATORS
export const getAllLocations = () => async (dispatch) => {
	try {
		const res = await axios.get('/api/locations');
		dispatch(getLocations(res.data || initialState.locations));
	} catch (error) {
		console.error(error);
	}
};

export const getOneLocation = (id) => async (dispatch) => {
	try {
		const res = await axios.get(`/api/locations/${id}`);
		dispatch(getLocation(res.data || initialState.locations));
	} catch (error) {
		console.error(error);
	}
};

export const getFilteredLocations = (category) => async (dispatch) => {
	try {
		const res = await axios.get(`/api/locations/filter/${category}`);
		dispatch(getLocations(res.data || initialState.locations));
	} catch (error) {
		console.error(error);
	}
};
export const getSearchResults = (question) => async (dispatch) => {
	try {
		const res = await axios.get(`/api/search/${question}`);
		dispatch(getLocations(res.data[0] && res.data[2]));
	} catch (err) {
		console.error(err);
	}
};
export const addReview = (content, id, userId, rating) => async (dispatch) => {
	try {
		const { data } = await axios.post(`/api/locations/${id}`, {
			content: content,
			locationId: id,
			userId: userId,
			rating: rating
		});
		console.log('DATA', data);
		dispatch(addNewReview(data));
	} catch (err) {
		alert('type more words man!');
	}
};

//to be refactored
export const addLocation = (address, imageUrl, quantity, description, category, price) => async (dispatch) => {
	try {
		const { data } = await axios.post('/api/locations', {
			category,
			address,
			description,
			quantity,
			price,
			imageUrl
		});
		dispatch(addNewLocation(data));
		history.push(`/singleLocation/${data.id}`);
	} catch (error) {
		console.error(error);
	}
};

export const updateLocation = (updatedLocation) => async (dispatch) => {
	try {
		const { data } = await axios.put(`/api/locations/${updatedLocation.id}`, updatedLocation);
		dispatch(updateExistingLocation(data));
		history.push(`/singleLocation/${data.id}`);
	} catch (error) {
		console.error(error);
	}
};

// REDUCER
export default function(state = initialState, action) {
	switch (action.type) {
		case ADD_NEW_LOCATION:
			{
				toast.success('Successfully Added Property');
			}
			return { ...state, locations: [ ...state.locations, action.location ] };
		case GET_LOCATIONS:
			return { ...state, locations: action.locations };
		case GET_LOCATION:
			return { ...state, selectedLocation: action.location, reviews: action.location.reviews };
		case UPDATE_LOCATION:
			let locations = [ ...state.locations ];
			let locationToUpdateIdx = locations.findIndex((location) => location.id === action.location.id);
			let updatedLocation = { ...locations[locationToUpdateIdx], ...action.location };
			locations[locationToUpdateIdx] = updatedLocation;
			{
				toast.success('Successfully Updated Property');
			}
			return { ...state, locations };
		case ADD_REVIEW:
			{
				toast.success('Successfully Added Review');
			}

			return {
				...state,
				content: [ ...state.content, action.content.content ],
				reviews: [ ...state.reviews, action.content ]
			};
		default:
			return state;
	}
}
