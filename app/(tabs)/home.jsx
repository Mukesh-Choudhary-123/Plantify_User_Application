import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CustomBanner from "../components/CustomBanner";
import CustomHeader from "../components/CustomHeader";
import {
  useFonts,
  Philosopher_400Regular,
  Philosopher_700Bold,
} from "@expo-google-fonts/philosopher";
import { FontAwesome } from "@expo/vector-icons";
import { useGetProductsQuery } from "../redux/api/productApi";
import ProductCard from "../components/CustomProductList";

const OPTION_WIDTH = 100;

const HomeScreen = () => {
  let [fontsLoaded] = useFonts({
    Philosopher_400Regular,
    Philosopher_700Bold,
  });

  const colors = [
    "#9CE5CB",
    "#FDC7BE",
    "#FFE899",
    "#56D1A7",
    "#B2E28D",
    "#DEEC8A",
    "#F5EDA8",
  ];
  const options = [
    "Top Pick",
    "Indoor",
    "Outdoor",
    "Fertilizer",
    "Plants",
    "Flowers",
    "Herbs",
    "Seeds",
    "Fruits",
    "Vegetables",
  ];

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [products, setProducts] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const filterListRef = useRef(null);
  const onEndReachedCalledDuringMomentum = useRef(true);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, error, isLoading } = useGetProductsQuery({
    page,
    limit: 5,
    search: searchQuery,
    category: selectedOption,
  });

  // Reset on query or filter change
  useEffect(() => {
    setPage(1);
    setProducts([]);
    setHasMore(true);
  }, [searchQuery, selectedOption]);

  // Append or replace products
  useEffect(() => {
    if (data?.products) {
      setProducts(prev =>
        page === 1 ? data.products : [...prev, ...data.products]
      );
      if (page >= data.totalPages) {
        setHasMore(false);
      }
    }
    setIsFetching(false);
  }, [data]);

  const loadMoreProducts = () => {
    if (!isFetching && hasMore) {
      setIsFetching(true);
      setPage(prev => prev + 1);
    }
  };

  const handleClearFilter = () => {
    setSearchInput("");
    setSearchQuery("");
    setSelectedOption("");
    filterListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const onSelectOption = (option, index) => {
    setSelectedOption(option);
    filterListRef.current?.scrollToIndex({ index, animated: true });
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <CustomHeader />

      {/* HEADER: Banner, Search, Filters */}
      <View style={styles.headerContainer} keyboardShouldPersistTaps="handled">
        {/* <CustomBanner /> */}

        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <FontAwesome name="search" size={20} color="#002140" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search Plant"
              placeholderTextColor="#002140"
              value={searchInput}
              onChangeText={setSearchInput}
            />
          </View>
          <TouchableOpacity onPress={handleClearFilter}  style={[
                styles.filterIcon,
                selectedOption && { backgroundColor: "#0D986A" }
              ]}>
            {/* <Image
              source={require("@/assets/images/filterIcon.png")}
              style={[
                styles.filterIcon,
                selectedOption && { backgroundColor: "#0D986A" }
              ]}
            /> */}
              <FontAwesome name="filter" size={25} color={"#002144"}/>

            
          </TouchableOpacity>
        </View>

        <FlatList
          ref={filterListRef}
          horizontal
          data={options}
          keyExtractor={item => item}
          showsHorizontalScrollIndicator={false}
          getItemLayout={(_, idx) => ({ length: OPTION_WIDTH, offset: OPTION_WIDTH * idx, index: idx })}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedOption === item && styles.activeFilterButton,
              ]}
              onPress={() => onSelectOption(item, index)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedOption === item && styles.activeFilterText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* PRODUCT LIST */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="black" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      )}
     
      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item, index }) => (
          <ProductCard
            id={item.id}
            title={item.title}
            subtitle={item.subtitle}
            prices={item.price}
            image={item.thumbnail}
            description={item.description}
            bgColor={colors[index % colors.length]}
          />
        )}
        onMomentumScrollBegin={() => { onEndReachedCalledDuringMomentum.current = false; }}
        onEndReached={() => {
          if (!onEndReachedCalledDuringMomentum.current) {
            loadMoreProducts();
            onEndReachedCalledDuringMomentum.current = true;
          }
        }}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={() => {
          if (isFetching) {
            return (
              <View style={styles.footerLoading}>
                <ActivityIndicator size="small" />
                <Text style={styles.footerLoadingText}>loading more...</Text>
              </View>
            );
          }
          if (!hasMore && products.length) {
            return <Text style={styles.noMore}>No more products</Text>;
          }
          return null;
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  headerContainer: { paddingHorizontal: 10 , paddingRight:15 , marginBottom:5},
  searchRow: { flexDirection: "row", alignItems: "center", marginTop:2 ,marginBottom:10 },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    paddingHorizontal: 10,
    alignItems: "center",
    height: 55,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: 40, fontSize: 16, color: "#002140" },
  filterIcon: {
    width: 55,
    height: 55,
    marginLeft: 10,
    tintColor: "#002140",
    borderRadius: 8,
    alignItems: "center",
    justifyContent:"center",
    backgroundColor: "#E0E0E0",
  },
  filterButton: {
    width: OPTION_WIDTH,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
  },
  activeFilterButton: { backgroundColor: "#0D986A" },
  filterText: { color: "#002140", fontSize: 14 },
  activeFilterText: { color: "#fff", fontWeight: "bold" },
  loadingOverlay: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -50 }, { translateY: -50 }],
    alignItems: "center",
  },
  loadingText: { fontSize: 18, marginTop: 8, color: "#002140" },
  footerLoading: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 10,
  },
  footerLoadingText: { marginLeft: 8, fontSize: 16, color: "#002140" },
  noMore: { textAlign: "center", padding: 10, color: "#888" },
});

export default HomeScreen;
