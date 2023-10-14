import MusicCard from "../Components/MusicCard";

const Home = (props) => {
    const {items} = props

    return (
        <div>
            {items.map(prop => <MusicCard {...prop}/>)}
        </div>
    )
}

export default Home;