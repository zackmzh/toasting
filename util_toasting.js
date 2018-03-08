import React from "react";
import PropTypes from "prop-types";
import {
  Modal,
  ActivityIndicator,
  StyleSheet,
  View,
  Animated,
  Dimensions,
  Text,
  ViewPropTypes as RNViewPropTypes
} from "react-native";
import Icon from "../components/Icon";
import fontStyles from "../src/style/font";

const ViewPropTypes = RNViewPropTypes || View.propTypes;

export const DURATION = {
  LENGTH_LONG: 2000,
  LENGTH_SHORT: 500,
  FOREVER: 0
};

const { height, width } = Dimensions.get("window");

export default class Toast extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isShow: false,
      text: "",
      opacityValue: new Animated.Value(this.props.opacity)
    };
  }

  show(text, duration) {
    this.duration =
      typeof duration === "number" ? duration : DURATION.LENGTH_SHORT;

    this.setState({
      isShow: true,
      text: text
    });

    Animated.timing(this.state.opacityValue, {
      toValue: this.props.opacity,
      duration: this.props.fadeInDuration
    }).start(() => {
      this.isShow = true;
      if (duration !== DURATION.FOREVER) this.close();
    });
  }

  close(duration) {
    let delay = typeof duration === "undefined" ? this.duration : duration;

    if (delay === DURATION.FOREVER) delay = this.props.defaultCloseDelay || 250;

    if (!this.isShow && !this.state.isShow) return;
    this.timer && clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      Animated.timing(this.state.opacityValue, {
        toValue: 0.0,
        duration: this.props.fadeOutDuration
      }).start(() => {
        this.setState({
          isShow: false
        });
        this.isShow = false;
      });
    }, delay);
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }

  render() {
    const view = this.state.isShow ? (
      <Modal transparent={true} onRequestClose={() => {}}>
        <View style={styles.container} pointerEvents="none">
          <Animated.View
            style={[
              styles.content,
              { opacity: this.state.opacityValue },
              this.props.style
            ]}
          >
            <View style={styles.iconContainer}>
              <ActivityIndicator size="large" color="white" />
            </View>
            {this.state.text ? (
              <Text style={[styles.text, fontStyles.baseText]}>
                {this.state.text}
              </Text>
            ) : null}
          </Animated.View>
        </View>
      </Modal>
    ) : null;
    return view;
  }
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    position: "absolute",
    left: 0,
    right: 0,
    padding: 20,
    elevation: 999,
    alignItems: "center",
    zIndex: 99999,
    backgroundColor: "rgba(0,0,0,0.2)"
  },
  content: {
    width: width * 0.4,
    minHeight: width * 0.35,
    top: height * 0.3,
    backgroundColor: "#2b2b2b",
    borderRadius: 20,
    padding: 10,
    flexDirection: "column"
  },
  iconContainer: {
    height: 100,
    alignItems: "center",
    justifyContent: "center"
  },
  icon: {
    color: "white"
  },
  text: {
    color: "white",
    textAlign: "center",
    fontSize: 17
  }
});

Toast.propTypes = {
  style: ViewPropTypes.style,
  fadeInDuration: PropTypes.number,
  fadeOutDuration: PropTypes.number,
  opacity: PropTypes.number
};

Toast.defaultProps = {
  fadeInDuration: 500,
  fadeOutDuration: 500,
  opacity: 0.6
};
