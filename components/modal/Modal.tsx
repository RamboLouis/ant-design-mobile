import React from 'react';
import {
  View, Text, Modal,
  TouchableHighlight,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
} from 'react-native';
import modalStyle from './style/index';
import ModalPropsType from './PropsType';
import RCModal from 'rc-dialog/lib/Modal';

const maxHeight = StyleSheet.create({
  'maxHeight': {
    maxHeight: Dimensions.get('window').height,
  },
}).maxHeight;

class AntmModal extends React.Component<ModalPropsType, any> {
  static defaultProps = {
    visible: false,
    closable: false,
    maskClosable: false,
    style: {},
    bodyStyle: {},
    animationType: 'fade',
    onClose() {
    },
    footer: [],
    transparent: false,
    animateAppear: true,
    styles: modalStyle,
  };

  root: any;

  onMaskClose = () => {
    if (this.props.maskClosable && this.props.onClose) {
      this.props.onClose();
    }
  }

  onFooterLayout = (e) => {
    if (this.root) {
      this.root.setNativeProps({
        style: [{ paddingBottom: e.nativeEvent.layout.height }, maxHeight],
      });
    }
  }

  saveRoot = (root) => {
    this.root = root;
  }

  render() {
    const {
      title, closable, footer, children, style, animateAppear,
      transparent, visible, onClose, bodyStyle, onAnimationEnd, styles,
    } = this.props;

    let btnGroupStyle = styles.buttonGroupV;
    let horizontalFlex = {};
    if (footer && footer.length === 2) {
      btnGroupStyle = styles.buttonGroupH;
      horizontalFlex = { flex: 1 };
    }
    const buttonWrapStyle = footer && footer.length === 2 ? styles.buttonWrapH : styles.buttonWrapV;
    let footerDom;
    if (footer && footer.length) {
      const footerButtons = footer.map((button: any, i) => {
        let buttonStyle = {};
        if (button.style) {
          buttonStyle = button.style;
          if (typeof buttonStyle === 'string') {
            const styleMap = {
              'cancel': { fontWeight: 'bold' },
              'default': {},
              'destructive': { color: 'red' },
            };
            buttonStyle = styleMap[buttonStyle] || {};
          }
        }
        const noneBorder = footer && footer.length === 2 && i === 1 ? { borderRightWidth: 0 } : {};
        const onPressFn = function() {
          if (button.onPress) {
            button.onPress();
          }
          if (onClose) {
            onClose();
          }
        };
        return (
          <TouchableHighlight key={i} style={horizontalFlex} underlayColor="#ddd" onPress={onPressFn}>
            <View style={[buttonWrapStyle, noneBorder]}>
              <Text style={[styles.buttonText, buttonStyle]}>{button.text || `按钮${i}`}</Text>
            </View>
          </TouchableHighlight>
        );
      });
      footerDom = (
        <View style={[btnGroupStyle, styles.footer]} onLayout={this.onFooterLayout}>
          {footerButtons}
        </View>
      );
    }

    let animType = this.props.animationType;
    if (transparent) {
      if (animType === 'slide') {
        animType = 'slide-up';
      }
      const closableDom = closable ? (
        <View style={[styles.closeWrap]}>
          <TouchableWithoutFeedback onPress={onClose}>
            <View>
              <Text style={[styles.close]}>×</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      ) : null;
      return (
        <View style={styles.container}>
          <RCModal
            onClose={this.onMaskClose}
            animationType={animType}
            wrapStyle={transparent ? styles.wrap : undefined}
            style={[styles.innerContainer, style]}
            visible={visible}
            onAnimationEnd={onAnimationEnd}
            animateAppear={animateAppear}
          >
            <View style={maxHeight} ref={this.saveRoot}>
              {title ? <Text style={[styles.header]}>{title}</Text> : null}
              <View style={[styles.body, bodyStyle]}>{children}</View>
              {footerDom}
              {closableDom}
            </View>
          </RCModal>
        </View>
      );
    }
    if (animType === 'slide-up' || animType === 'slide-down' || animType === 'slide') {
      animType = 'slide';
    }
    return (
      <View style={styles.container}>
        <Modal
          visible={visible}
          animationType={animType}
          onRequestClose={this.onMaskClose}
        >
          <View style={style}>
            {children}
          </View>
        </Modal>
      </View>
    );
  }
}

export default AntmModal;
