import { View } from 'react-native';
import PokemonSearch from '../components/PokemonSearch';

export default function Index() {
  return (
    <View style={{ flex: 1 }}>
      <PokemonSearch />
    </View>
  );
}