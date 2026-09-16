import React, { useState } from "react";
import {
    Image,
    Keyboard,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Pokemon from "../interface/InterfacePokemon";
import PokemonRequests from "../services/PokemonRequests";

export default function PokemonSearch() {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPokemon, setCurrentPokemon] = useState<Pokemon | null>(null);
    const [chainCount, setChainCount] = useState(1);
    const [showShiny, setShowShiny] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const shinyChance = Math.min(100, (chainCount / 4096) * 100);
    const displayedSprite = showShiny
        ? currentPokemon?.pokemon_shiny_image || currentPokemon?.pokemon_image
        : currentPokemon?.pokemon_image;

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
                const isDifferentPokemon = !currentPokemon || currentPokemon.pokemon_id !== result.pokemon_id;

                setCurrentPokemon(result);
                setShowShiny(false);
                setChainCount(isDifferentPokemon ? 1 : chainCount);
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

    const handleChainIncrement = () => {
        if (!currentPokemon) {
            return;
        }

        setChainCount((prev) => prev + 1);
    };

    const handleResetChain = () => {
        setChainCount(1);
        setShowShiny(false);
    };

    const toggleShinySprite = () => {
        if (!currentPokemon) {
            return;
        }

        setShowShiny((prev) => !prev);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>PokéSearch 🔍</Text>
                <Text style={styles.subtitle}>
                    Atividade Avaliativa: busque um Pokémon pelo nome ou número.
                </Text>
            </View>

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

            {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

            {currentPokemon ? (
                <View style={styles.card}>
                    <Image
                        style={styles.image}
                        source={displayedSprite ? { uri: displayedSprite } : undefined}
                    />

                    <Text style={styles.foundText}>POKÉMON ENCONTRADO!</Text>
                    <Text style={styles.name}>{currentPokemon.pokemon_name}</Text>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>ID:</Text>
                        <Text style={styles.value}>{currentPokemon.pokemon_id}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Tipagem:</Text>
                        <Text style={styles.value}>{currentPokemon.types?.join(", ")}</Text>
                    </View>

                    <View style={styles.descriptionBox}>
                        <Text style={styles.label}>Descrição:</Text>
                        <Text style={styles.description}>
                            {currentPokemon.description || "Nenhuma descrição encontrada."}
                        </Text>
                    </View>

                    <View style={styles.shinyPanel}>
                        <Text style={styles.shinyTitle}>Shiny Chaining</Text>
                        <Text style={styles.shinyText}>Sequência Atual: {chainCount}</Text>
                        <Text style={styles.shinyText}>Chance de Shiny: {shinyChance.toFixed(2)}%</Text>
                    </View>

                    <TouchableOpacity
                        activeOpacity={0.85}
                        style={styles.shinyButton}
                        onPress={toggleShinySprite}
                    >
                        <Text style={styles.shinyButtonText}>
                            {showShiny ? "Ver Sprite Normal" : "Ver Sprite Shiny"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={styles.incrementButton}
                        onPress={handleChainIncrement}
                    >
                        <Text style={styles.incrementButtonText}>+1 na Sequência</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={styles.resetButton}
                        onPress={handleResetChain}
                    >
                        <Text style={styles.resetButtonText}>Zerar Sequência</Text>
                    </TouchableOpacity>
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
    input: {
        backgroundColor: "#eef3f8",
        color: "#162033",
        fontSize: 16,
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#c8d4e3",
    },
    button: {
        backgroundColor: "#e3350d",
        borderRadius: 12,
        padding: 14,
        alignItems: "center",
        marginBottom: 12,
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
        borderRadius: 10,
        marginBottom: 16,
        fontWeight: "600",
    },
    card: {
        backgroundColor: "#ffffff",
        borderRadius: 18,
        padding: 20,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#d9e1ec",
        marginTop: 8,
        shadowColor: "#0f172a",
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 20,
        elevation: 4,
    },
    image: {
        width: 150,
        height: 150,
        resizeMode: "contain",
        marginBottom: 12,
        backgroundColor: "#f8fafc",
        borderRadius: 18,
    },
    foundText: {
        color: "#269c56",
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 8,
        letterSpacing: 0.8,
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
        marginBottom: 12,
    },
    description: {
        fontSize: 15,
        color: "#4f5f72",
        lineHeight: 22,
        marginTop: 8,
    },
    shinyPanel: {
        width: "100%",
        backgroundColor: "#fff8df",
        borderRadius: 14,
        padding: 14,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: "#f4d35e",
    },
    shinyTitle: {
        color: "#8b6a00",
        fontSize: 12,
        fontWeight: "800",
        textTransform: "uppercase",
        marginBottom: 8,
        letterSpacing: 1,
    },
    shinyText: {
        color: "#1e293b",
        fontSize: 15,
        fontWeight: "700",
        marginBottom: 4,
    },
    shinyButton: {
        width: "100%",
        backgroundColor: "#fbbf24",
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: "center",
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#f59e0b",
    },
    shinyButtonText: {
        color: "#3a2b00",
        fontSize: 15,
        fontWeight: "800",
    },
    incrementButton: {
        width: "100%",
        backgroundColor: "#22c55e",
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: "center",
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#16a34a",
    },
    incrementButtonText: {
        color: "#ffffff",
        fontSize: 15,
        fontWeight: "800",
    },
    resetButton: {
        width: "100%",
        backgroundColor: "#ef4444",
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#dc2626",
    },
    resetButtonText: {
        color: "#ffffff",
        fontSize: 15,
        fontWeight: "800",
    },
    emptyBox: {
        backgroundColor: "#ffffff",
        borderRadius: 18,
        padding: 20,
        borderWidth: 1,
        borderColor: "#d9e1ec",
        alignItems: "center",
        marginTop: 8,
    },
    emptyText: {
        color: "#6b7280",
        fontSize: 15,
        textAlign: "center",
    },
});

