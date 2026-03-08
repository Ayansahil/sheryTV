import axios from 'axios';

const instance = axios.create({
    baseURL: "https://api.themoviedb.org/3/",
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiY2U1NWM5ZTUwMzgwZWJiNTE5MTNhMTUyYjFmMzY3ZiIsIm5iZiI6MTc0MDU1NTA3Mi42NTUsInN1YiI6IjY3YmVjMzQwMGZmNjY0M2U3MTNkNDk2ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EWpe7WAjpLxpqWEthBq3LtrYnwH3LXZdB41G2xND4UM'
    },
});

export default instance;