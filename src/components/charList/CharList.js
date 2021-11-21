import { Component } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelServices';
import './charList.scss';

class CharList extends Component {
    state = {
        charList: [],
        loading: true,
        error: false,
        offset: 210,
        newCharListLoading: false,
        charEnded: false,
    }

    marvelService = new MarvelService();
    
    componentDidMount() {
        this.updateCharacters();
    }

    updateCharacters = (offset) => {
        this.setState({newCharListLoading: true});

        this.marvelService.getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError);
    }

    onCharListLoaded = (newCharList) => {
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }

        this.setState(({charList, offset}) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            offset: offset + 9,
            newCharListLoading: false,
            charEnded: ended
        }));
    }

    onError = () => {
        this.setState({
            error: true,
            loading: false
        });
    }

    renderItems = (charList) => {
        const items = charList.map(item => {

            let imgStyle = {'objectFit' : 'cover'};
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg' ||
                item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708.gif') {
                imgStyle = {'objectFit' : 'unset'};
            }

            return (
                <li className="char__item" key={item.id} onClick={() => this.props.onSelectedId(item.id)}>
                    <img src={item.thumbnail} alt={item.name} style={imgStyle}/>
                    <div className="char__name">{item.name}</div>
                </li>
            );
        });

        return (
            <ul className="char__grid">
                {items}    
            </ul>
        );
    }

    render() {
        const {charList, loading, error, offset, newCharListLoading, charEnded} = this.state;
        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? this.renderItems(charList) : null;

        return (
            <div className="char__list">
                {errorMessage}
                {spinner}
                {content}
                <button 
                    className="button button__main button__long"
                    style={{'display': charEnded ? 'none' : 'block'}}
                    onClick={() => this.updateCharacters(offset)}
                    disabled={newCharListLoading}
                >
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;