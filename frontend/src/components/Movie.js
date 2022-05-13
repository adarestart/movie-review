import React from 'react';
import axios from 'axios';
import { Row, Card,Container, Table,Button, Breadcrumb,ButtonGroup} from 'react-bootstrap';
import moment from 'moment';
axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
axios.defaults.xsrfCookieName = "csrftoken";


export default class MovieList extends React.Component {

  state = {
    movie_list:[],
    movie_item:[],
    show_movie:false,
 

    
  }

  componentDidMount() {

  }
  handleTitle = event => {
    console.log(event.target.value)
    this.setState({search_title: event.target.value});
    console.log(this.state.search_title)
  }
  refreshList(){
    axios.get(`http://localhost:8000/api/movies/`)
    .then(response => {
        console.log(response.data.data)
        const posts = response.data.data.filter(home => home.title.includes(this.state.search_title));
        console.log(posts.length);
        posts.length?this.setState ({ movie_item: posts[0],show_movie:true},() => { 
            console.log(
              "Status Updated: ",
              this.state.movie_item
            );}):this.callOmdbapi();
        })
  }

  callOmdbapi = () => {
    axios.get(`http://www.omdbapi.com/?apikey=79d6560d&t=${this.state.search_title}`)
    .then(response => {
    console.log(response.data)
    const posts = response.data; 
    this.setState ({ movie_item: posts},() => { this.postMovie();
        console.log(
          "Status Updated: ",
          this.state.movie_item
        );});
    })

  }
  postMovie = () =>{
    axios.post(`http://localhost:8000/api/movies/`, {
        id:1,
        title: this.state.movie_item.Title,
        poster: null,
        poster_url: this.state.movie_item.Poster,
        description: this.state.movie_item.Plot,
        released: "2019-06-21",
        director: this.state.movie_item.Director,
        actors: this.state.movie_item.Actors,
        likes: 0,
        dislikes:0,
      }).then(res => {
        const posts = res.data;
        console.log(res);
        console.log(res.data);
        this.setState ({ movie_item: posts,show_movie:true},() => { 
            console.log(
              "Status Updated: ",
              this.state.movie_item
            );});
        })

  }
  updateMovies = event => {

    if (event.target.id) {
      axios
        .put(`http://localhost:8000/api/movies/${event.target.id}/${Number(event.target.value)}/`)
        .then(response => {
        console.log(response);
        const posts = response.data.data;
        console.log(posts);
        this.setState ({ movie_item: posts,show_movie:true},() => { 
            console.log(
              "Status Updated: ",
              this.state.movie_item
        );});
        
        })
    }
  }
  showDetailTable= () =>{
    //var obj = this.state.movie_item;
    /* {this.state.data_list.map(home => <form id = {home.id} onSubmit={this.handleEdit}>{Object.keys(home).map(function(key){return <label>{key}<input id ={key} type="text" name={key} value = {home[key]} /></label>})}<button type="submit">Book</button></form>)}
          */
    return( 
    <Row className="justify-content-center" md="auto">
      <Card style={{ width: '18rem',background: 'linear-gradient( #e1f8dc, #caf1de)'}}>
    
       <Card.Body>
         <Card.Title>Movie Title: {this.state.movie_item.title}</Card.Title>
         <Card.Subtitle className="mb-2 text-muted">{this.state.movie_item.released}</Card.Subtitle>
         <Card.Text>Director: {this.state.movie_item.director}</Card.Text>
         <Card.Text>Actors: {this.state.movie_item.actors}</Card.Text>
         <Card.Text>Description: {this.state.movie_item.description}</Card.Text>
         <Card.Text>Likes: {this.state.movie_item.likes} <Button id= {this.state.movie_item.id} value="1" variant="secondary" onClick={this.updateMovies}>Likes</Button>
         </Card.Text>
         <Card.Text>Dislikes: {this.state.movie_item.dislikes} <Button id= {this.state.movie_item.id} value="0" variant="secondary" onClick={this.updateMovies}>Dislikes</Button>
        </Card.Text>
         </Card.Body>
      </Card>
      </Row>
    )
  }

  
  render() {
   
    return (
      
      <div className="movies">
        <h1>Search Movie</h1>
        
        <label>Please enter the movie title:
              <input type="text" name="title" onChange={this.handleTitle.bind(this)}/>
          </label> 
          <Button  variant="secondary" onClick={this.refreshList.bind(this)}>Search</Button>
          {this.state.show_movie?this.showDetailTable():null}
        

      </div>
      

  )}
}
