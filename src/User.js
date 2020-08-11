/* Core */
import React, { useRef, useEffect, useState } from "react";

/* Presentational */
import {
  View,
  Text,
  Image,
  Alert,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Animated,
  PanResponder
} from "react-native";

import Icon from "react-native-vector-icons/FontAwesome";

const { width } = Dimensions.get("window");

export default function User({ user, onPress }) {

  const offset = useRef( new Animated.ValueXY({ x: 0, y: 50 })).current;
  const opacity = useRef( new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(offset.y, {
        toValue: 0,
        speed: 5,
        bounciness: 20,
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }),
    ]).start();
  })

  const _panResponder = useState(
    PanResponder.create({
      onPanResponderTerminationRequest: () => false,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderMove: Animated.event([null, {
        dx: offset.x,
      }], { useNativeDriver: false }),

      onPanResponderRelease: () => {
        if(offset.x._value < -200) {
          Alert.alert('Deletado!')
        }

        Animated.spring(offset.x, {
          toValue: 0,
          bounciness: 20,
          useNativeDriver: false
        }).start();
      },

      onPanResponderTerminate: () => {
        Animated.spring(offset.x, {
          toValue: 0,
          bounciness: 20,
          useNativeDriver: false
        }).start();
      }
    }),
  )[0];

  return (
    <Animated.View
      {..._panResponder.panHandlers}
      style={[
        { transform: [
          ...offset.getTranslateTransform(),
          { rotateZ: offset.x.interpolate({ 
            inputRange: [width * -1, width],
            outputRange: ['-50deg', '50deg']
          })}
        ] },
        { opacity: opacity },
      ]}
    >
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={styles.userContainer}>
          <Image style={styles.thumbnail} source={{ uri: user.thumbnail }} />

          <View style={[styles.infoContainer, { backgroundColor: user.color }]}>
            <View style={styles.bioContainer}>
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.description}>{user.description}</Text>
            </View>
            <View style={styles.likesContainer}>
              <Icon name="heart" size={12} color="#FFF" />
              <Text style={styles.likes}>{user.likes}</Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  userContainer: {
    marginTop: 10,
    borderRadius: 10,
    flexDirection: "column",
    marginHorizontal: 15
  },

  thumbnail: {
    width: "100%",
    height: 150
  },

  infoContainer: {
    backgroundColor: "#57BCBC",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 15
  },

  bioContainer: {
    flex: 1
  },

  name: {
    color: "#FFF",
    fontWeight: "900",
    fontSize: 10
  },

  description: {
    color: "#FFF",
    fontSize: 13,
    marginTop: 2
  },

  likesContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 20
  },

  likes: {
    color: "#FFF",
    fontSize: 12,
    marginLeft: 5
  }
});
