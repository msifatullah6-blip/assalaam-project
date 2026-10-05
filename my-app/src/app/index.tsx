import { Text, View, ScrollView, TextInput, Image, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import db from "../../db/firebaseConfig";
import { Button } from "expo-router/build/react-navigation";
import { useRouter } from "expo-router"
import s from "./style/styles";

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
    <View style={s.container}>
      <View style={s.header}>
        <TextInput style={[s.input, {flex: 1}]} placeholder="Cari Produk" value={search} onChangeText={setSearch}></TextInput>
        <Button onPress={() => router.push("/input")}>Tambah</Button>
      </View>
      <ScrollView>
        {prices.map((price) => (
          <Pressable key={price.id} onPress={() => router.push({pathname: '/detail', params: { id: price.id }})}>
            <View style={s.listContainer}>
              {
                !price.image[0]?<View style={s.image} />:<Image style={s.image} source={{uri: price.image[0]}}></Image>
              }
              <View style={s.listContent}>
                <Text style={s.text}>{price.name}</Text>
                <Text style={[s.text, {color: '#fff8', fontSize: 20}]}>Rp. {price.price}</Text>
              </View>
            </View>
          </Pressable>
          
        ))}
      </ScrollView>
    </View>
  );
}
