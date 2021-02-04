import React, { Component } from 'react';
import { fetchApiUrl, getCharacters } from '../api';
import { Link } from 'react-router-dom';
import { 
    CharacterCard, 
    CharacterCardWrapper, 
    ContentWrapper,
    CharacterCardImage,
    StatusDot, 
    GenderIconWrapper} from '../style/styleCharacterCard';
 
import { ReactComponent as MaleIcon } from '../assets/gender_icon_male.svg';
import { ReactComponent as FemaleIcon } from '../assets/gender_icon_female.svg';
// import PropTypes from 'prop-types';

export default class Characters extends Component {
    // static propTypes = {
    //     prop: PropTypes
    // };
    constructor(props){
        super(props);
        this.state = { characters: [], prev: null, next: null }
    }

    async componentDidMount() {
        const pageSearchQuery = this.props.location.search;
        const data = await getCharacters(pageSearchQuery); //getting only images - for first page
        
        if (!data.error){
            const { results, info: {prev}, info: {next} } = data;
            this.updateStates(results, prev, next);
        }
    }

    renderCharacters() {
        let images;
        
        this.state.characters.length ? 
            images = this.state.characters.map(
                (data) => { return (<CharacterCard>
                    <CharacterCardImage key={data.id} src={data.image}/>
                    <ContentWrapper>
                        <div className="content-item">
                            <h2>{data.name}</h2>
                        </div>
                        <div className="content-item">
                            <GenderIconWrapper>{data.gender === "Male" ? <MaleIcon className="gender-icon" /> : data.gender === "Female" ? <FemaleIcon className="gender-icon" /> : ""}</GenderIconWrapper>
                        </div>
                        <div className="content-item">
                            <StatusDot isAlive={data.status} /> {data.status} - {data.species} 
                        </div>
                        {data.type.length ? <div>Type: {data.type}</div>  : ""}
                        <div className="content-item">
                            Last known location: {data.location.name}
                        </div>
                        <div className="content-item">
                            First seen in: {data.origin.name}
                        </div>
                    </ContentWrapper>
                    </CharacterCard>) }
                ) :
            images = (<div>There's nothing to show</div>);
        return images;
    }

    changePage = async (url) => {
        const { results, info: {prev}, info: {next} } = await fetchApiUrl(url);
        this.updateStates(results, prev, next);
    }

    updateStates = (characters, prev, next) => {
        this.setState({ characters, prev, next });
    }

    updateUrl = (newUrl) => {
        const url = new URL(newUrl);
        return `/characters${url.search}`;
    }

    render() {
        return (
            <>
                <div>
                    {this.state.prev ?
                                    <Link to={() => this.updateUrl(this.state.prev)}
                                     onClick={() => this.changePage(this.state.prev)}>Previous</Link>
                                    : ""}
                    {this.state.next ?
                                    <Link to={() => this.updateUrl(this.state.next)}
                                    onClick={() => this.changePage(this.state.next)}>Next</Link>
                                    : ""}
                </div>
                <CharacterCardWrapper>
                        {this.renderCharacters()}
                </CharacterCardWrapper>
            </>
        )
    }
}