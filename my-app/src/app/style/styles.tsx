import { StyleSheet } from "react-native";
const s = StyleSheet.create({
    container: {
        flex: 1, 
        padding: 20, 
        backgroundColor: '#222'
    },
    header: {
        justifyContent: 'space-between', 
        paddingBottom: 20,
        flexDirection:'row',
        gap: 10
    },
    form: {
        backgroundColor: '#111',
        padding: 20,
        borderRadius: 12,
        gap: 12,
        paddingBottom: 50
    },
    listContainer: { 
        backgroundColor: '#111',
        borderRadius: 12,
        marginBottom: 10,
        padding: 10
    },
    listContent: {
        marginBottom: 20,
        gap: 12,
    },
    image: {
        height: 250,
        backgroundColor: '#333',
        borderRadius: 12,
        marginBottom: 10,
    },
    text: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18
    },
    input: {
        backgroundColor: '#333',
        borderRadius: 12,
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
        padding: 12
    }
})

export default s