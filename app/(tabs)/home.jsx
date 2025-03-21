import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import CustomBanner from "../components/CustomBanner";
import CustomHeader from "../components/CustomHeader";
import {
  useFonts,
  Philosopher_400Regular,
  Philosopher_700Bold,
} from "@expo-google-fonts/philosopher";
import { FontAwesome } from "@expo/vector-icons";
import { useGetProductsQuery } from "../../redux/api/productApi";
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
  const [search, setSearch] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [products, setProducts] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const onEndReachedCalledDuringMomentum = useRef(true);

  const { data, error, isLoading } = useGetProductsQuery({
    page,
    limit: 5,
    search: search,
    category: selectedOption,
  });

  console.log("Page:", page);
  console.log("Category:", selectedOption);
  console.log("Search:", search);

  // Reset pagination and products when filter or search changes
  useEffect(() => {
    setPage(1);
    setProducts([]);
    setHasMore(true);
  }, [search, selectedOption]);

  useEffect(() => {
    if (data?.products) {
      setProducts((prevProducts) =>
        page === 1 ? data.products : [...prevProducts, ...data.products]
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
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleClearFilter = () => {
    setSearch("");
    setSelectedOption("");
  };

  const renderHeader = () => (
    <View>
      <CustomBanner />
      {/* Search Bar */}
      <View style={{ flexDirection: "row" }}>
        <View style={styles.searchContainer}>
          <FontAwesome
            name="search"
            size={20}
            color="#002140"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Plant"
            placeholderTextColor="#002140"
            onChangeText={setSearch}
            value={search}
          />
        </View>
        <TouchableOpacity onPress={handleClearFilter}>
          <Image
            source={require("@/assets/images/filterIcon.png")}
            style={styles.filterIcon}
          />
        </TouchableOpacity>
      </View>
      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
      >
        {options.map((option, key) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.filterButton,
              selectedOption === option && styles.activeFilterButton,
            ]}
            onPress={() => setSelectedOption(option)}
          >
            <Text
              style={[
                styles.filterText,
                selectedOption === option && styles.activeFilterText,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      <CustomHeader />
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="black" />
          <Text
            style={{
              fontSize: 18,
              marginTop: 5,
              fontWeight: 600,
              color: "#002140",
              marginLeft: 15,
            }}
          >
            Loading...
          </Text>
        </View>
      )}
      <FlatList
        key={selectedOption}
        data={products}
        keyExtractor={(item) => item.id.toString()}
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
        onMomentumScrollBegin={() => {
          onEndReachedCalledDuringMomentum.current = false;
        }}
        onEndReached={() => {
          if (!onEndReachedCalledDuringMomentum.current) {
            loadMoreProducts();
            onEndReachedCalledDuringMomentum.current = true;
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => {
          if (isFetching) {
            return (
              <View style={{  flexDirection:"row" ,alignSelf:"center" ,justifyContent:"center" }}>
                <ActivityIndicator
                  size="small"
                  color="#000"
                  style={{ marginTop: 10 }}
                />
                <Text
                  style={{
                    fontSize: 16,
                    marginTop: 8,
                    fontWeight: 600,
                    color: "#002140",
                    marginLeft: 5,
                  }}
                >
                  loading more...
                </Text>
              </View>
            );
          }
          if (!hasMore && products.length > 0) {
            return (
              <Text style={{ textAlign: "center", padding: 5 }}>
                No more products
              </Text>
            );
          }
          if (isLoading) {
            return (
              <View
                style={{
                  justifyContent: "center",
                  alignSelf: "center",
                  height: "100%",
                }}
              >
                <ActivityIndicator size="large" color="black" />
              </View>
            );
          }
          return null;
        }}
        // ListEmptyComponent={() => {
        //   if (isFetching || isLoading) {
        //     return (
        //       <View
        //         style={{
        //           justifyContent: "center",
        //           alignSelf: "center",
        //           height: "100%",
        //         }}
        //       >
        //         <ActivityIndicator size="small" color="black" />
        //       </View>
        //     );
        //   }
        // }}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
    marginTop: "40%",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#002140",
    borderRadius: 14,
    marginHorizontal: 10,
    marginTop: 10,
    paddingHorizontal: 10,
    height: 55,
    width: "80%",
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filterIcon: {
    marginTop: 10,
    height: 55,
    width: 50,
  },
  filterContainer: {
    flexDirection: "row",
    marginTop: 10,
    marginHorizontal: 15,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#002140",
    marginLeft: 7,
  },
  activeFilterButton: {
    backgroundColor: "#0D986A",
    borderColor: "#0D986A",
  },
  filterText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#002140",
  },
  activeFilterText: {
    color: "white", // Active text color
  },
});
