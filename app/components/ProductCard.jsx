import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ProductCard = () => {
    const product = {
        title: "Aleo Vera",
        prices: 200,
        subtitle: "Air Purifier",
    }
  return (
    <View style={styles.container}>
      <Text>ProductCard</Text>
    </View>
  )
}

export default ProductCard

const styles = StyleSheet.create({
    container: {
        height:200
    }
})