import MusicCard from "../Components/MusicCard";

const Home = (props) => {
    const {items} = props

    return (
        <div>
            {items.map(prop => <MusicCard key={"MusicCard" + prop["id"]} {...prop}/>)}
        </div>
    )
}

export default Home;