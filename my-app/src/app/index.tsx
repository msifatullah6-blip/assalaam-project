import { Text, View, StyleSheet, ScrollView, TextInput, Image } from "react-native";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import db from "../../db/firebaseConfig";
import { Button } from "expo-router/build/react-navigation";
import { useRouter } from "expo-router"

type Price = {
  id: string;
  name: string;
  price: string;
  image: string[];
};

export default function Index() {
  const [prices, setPrices] = useState<Price[]>([]);
  const [search, setSearch] = useState('')
  const [allPr, setAllPr] = useState<Price[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const snapshot = await getDocs(collection(db, "prices"));
        const data = snapshot.docs.map((doc) => {
          const d = doc.data();
          return { id: doc.id, name: d.name, price: d.price, image: d.image };
        });
        setAllPr(data);
      } catch (err) {
        console.error("Error fetching prices:", err);
      }
    };
    fetchPrices();
  }, [allPr]);

  useEffect(() => {
    if(search === '')
      setPrices(allPr)
    else{
      const hasil = allPr.filter((item) => 
        item.name.toLowerCase().includes(search.toLowerCase())
      )
      setPrices(hasil)
    }
  }, [search, allPr])

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput style={styles.input} placeholder="Cari Produk" value={search} onChangeText={setSearch}></TextInput>
        <Button onPress={() => router.push("/input")}>Tambah</Button>
      </View>
      <ScrollView>
        {prices.map((price) => (
          <View key={price.id} style={styles.listContainer}>
            {
              !price.image[0]?<View style={styles.image} />:<Image style={styles.image} source={{uri: price.image[0]}}></Image>
            }
            <View style={styles.listContent}>
              <Text style={styles.text}>{price.name}</Text>
              <Text style={[styles.text, {color: '#fff8', fontSize: 20}]}>Rp. {price.price}</Text>
            </View>
            <View style={styles.listContent}>
              <Button onPressIn={() => router.push({pathname: '/detail', params: { id: price.id, name: price.name, price: price.price, image: JSON.stringify(price.image) }})}>Lihat Detail</Button>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
  image: {
    height: 200,
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 12,
    marginBottom: 10
  },
  listContainer: { 
    backgroundColor: '#111',
    borderRadius: 12,
    marginBottom: 10,
    padding: 10,
  },
  listContent: {
    marginBottom: 20,
    gap: 12,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 25
  },
  input: {
        backgroundColor: '#333',
        borderRadius: 12,
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
        padding: 12,
        flex: 1
    }
});