import React, { useState } from "react";
import {
    Image,
    Keyboard,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import PokemonRequests from "../services/PokemonRequests";
import Pokemon from "../interface/InterfacePokemon";

export default function PokemonSearch() {
    const [searchQuery, setSearchQuery] = useState("");
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            setErrorMsg("Digite o nome ou número de um Pokémon.");
            return;
        }
        setLoading(true);
        setErrorMsg("");
        Keyboard.dismiss();

        try {
            const result = await PokemonRequests.fetchPokemonData(searchQuery);

            if (result) {
                setPokemon(result);
                setSearchQuery("");
            } else {
                setErrorMsg("Não foi possível obter os dados do Pokémon.");
            }
        } catch (error) {
            setErrorMsg("Erro ao buscar o Pokémon. Tente novamente.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <SafeAreaView style={{ flex: 1, padding: 20 }}>
            <View>
                <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>PokéSearch 🔍</Text>

                <Text style={{ marginBottom: 20 }}>
                    Atividade Avaliativa: busque um Pokémon pelo nome ou número.
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Digite o nome ou ID (ex: bulbasaur ou 1)"
                    placeholderTextColor="#8d8d99"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onSubmitEditing={handleSearch}
                />
                <Pressable style={styles.button} onPress={handleSearch}>
                    <Text style={styles.buttonText}>
                        {loading ? "Buscando..." : "Buscar"}
                    </Text>
                </Pressable>



                {/* Exibir as informações aqui */}
            </View>
            {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

            {pokemon ? (
                <View style={styles.card}>
                    <Image
                        style={styles.image}
                        source={{ uri: pokemon.pokemon_image }}
                    />

                    <Text style={styles.foundText}>POKÉMON ENCONTRADO!</Text>

                    <Text style={styles.name}>{pokemon.pokemon_name}</Text>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>ID:</Text>
                        <Text style={styles.value}>{pokemon.pokemon_id}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Tipagem:</Text>
                        <Text style={styles.value}>{pokemon.types?.join(", ")}</Text>
                    </View>

                    <View style={styles.descriptionBox}>
                        <Text style={styles.label}>Descrição:</Text>
                        <Text style={styles.description}>
                            {pokemon.description || "Nenhuma descrição encontrada."}
                        </Text>
                    </View>
                </View>
            ) : (
                <View style={styles.emptyBox}>
                    <Text style={styles.emptyText}>
                        As informações do Pokémon aparecerão aqui.
                    </Text>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f3f6fb",
        padding: 20,
    },
    header: {
        marginBottom: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#22314f",
    },
    subtitle: {
        fontSize: 16,
        color: "#5f6b7a",
        marginTop: 6,
    },
    searchBox: {
        backgroundColor: "#ffffff",
        borderRadius: 8,
        padding: 14,
        borderWidth: 1,
        borderColor: "#d9e1ec",
        marginBottom: 16,
    },
    input: {
        backgroundColor: "#eef3f8",
        color: "#162033",
        fontSize: 16,
        borderRadius: 6,
        padding: 14,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#c8d4e3",
    },
    button: {
        backgroundColor: "#e3350d",
        borderRadius: 6,
        padding: 14,
        alignItems: "center",
    },
    buttonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
    },
    error: {
        color: "#b42318",
        backgroundColor: "#ffe7e3",
        padding: 12,
        borderRadius: 6,
        marginBottom: 16,
    },
    card: {
        backgroundColor: "#ffffff",
        borderRadius: 8,
        padding: 20,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#d9e1ec",
    },
    image: {
        width: 130,
        height: 130,
        resizeMode: "contain",
        marginBottom: 12,
    },
    foundText: {
        color: "#269c56",
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 8,
    },
    name: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#22314f",
        textTransform: "capitalize",
        marginBottom: 16,
    },
    infoRow: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#edf1f6",
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#34445c",
    },
    value: {
        fontSize: 16,
        color: "#4f5f72",
        textTransform: "capitalize",
    },
    descriptionBox: {
        width: "100%",
        marginTop: 16,
    },
    description: {
        fontSize: 15,
        color: "#4f5f72",
        lineHeight: 22,
        marginTop: 8,
    },
    emptyBox: {
        backgroundColor: "#ffffff",
        borderRadius: 8,
        padding: 20,
        borderWidth: 1,
        borderColor: "#d9e1ec",
        alignItems: "center",
    },
    emptyText: {
        color: "#6b7280",
        fontSize: 15,
        textAlign: "center",
    },
});



