import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const buttonSize = (width - 64) / 4; // Padding & gaps adjusted

interface CalculatorProps {
  onClose: () => void;
}

export default function Calculator({ onClose }: CalculatorProps) {
  const [display, setDisplay] = useState('0');
  const [prevVal, setPrevVal] = useState<string | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [resetOnNext, setResetOnNext] = useState(false);

  const pressBtn = (val: string) => {
    if (val === 'AC') {
      setDisplay('0');
      setPrevVal(null);
      setOperator(null);
      setResetOnNext(false);
    } else if (val === '+/-') {
      if (display !== '0') {
        setDisplay(display.startsWith('-') ? display.slice(1) : '-' + display);
      }
    } else if (val === '%') {
      setDisplay((parseFloat(display) / 100).toString());
    } else if (['+', '-', '×', '÷'].includes(val)) {
      setPrevVal(display);
      setOperator(val);
      setResetOnNext(true);
    } else if (val === '=') {
      if (operator && prevVal !== null) {
        const result = calculate(parseFloat(prevVal), parseFloat(display), operator);
        setDisplay(result.toString().slice(0, 10));
        setOperator(null);
        setPrevVal(null);
        setResetOnNext(true);
      }
    } else {
      // Number input
      if (display === '0' || resetOnNext) {
        setDisplay(val);
        setResetOnNext(false);
      } else {
        if (val === '.' && display.includes('.')) return;
        setDisplay(display + val);
      }
    }
  };

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  const Row = ({ children }: { children: React.ReactNode }) => (
    <View style={styles.row}>{children}</View>
  );

  const Button = ({ text, type, size = 'small' }: { text: string; type: 'gray' | 'dark' | 'orange'; size?: 'small' | 'large' }) => {
    const btnStyle = [
      styles.button,
      type === 'gray' ? styles.btnGray : type === 'orange' ? styles.btnOrange : styles.btnDark,
      size === 'large' ? styles.btnLarge : null
    ];
    const textStyle = [
      styles.btnText,
      type === 'gray' ? styles.textDark : styles.textLight,
      size === 'large' ? styles.textLarge : null
    ];

    return (
      <TouchableOpacity style={btnStyle} onPress={() => pressBtn(text)}>
        <Text style={textStyle}>{text}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Text style={styles.closeText}>✕ Close</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Calculator</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.displayContainer}>
        <Text style={styles.displayText} numberOfLines={1} adjustsFontSizeToFit>
          {display}
        </Text>
      </View>

      <View style={styles.pad}>
        <Row>
          <Button text="AC" type="gray" />
          <Button text="+/-" type="gray" />
          <Button text="%" type="gray" />
          <Button text="÷" type="orange" />
        </Row>
        <Row>
          <Button text="7" type="dark" />
          <Button text="8" type="dark" />
          <Button text="9" type="dark" />
          <Button text="×" type="orange" />
        </Row>
        <Row>
          <Button text="4" type="dark" />
          <Button text="5" type="dark" />
          <Button text="6" type="dark" />
          <Button text="-" type="orange" />
        </Row>
        <Row>
          <Button text="1" type="dark" />
          <Button text="2" type="dark" />
          <Button text="3" type="dark" />
          <Button text="+" type="orange" />
        </Row>
        <Row>
          <Button text="0" type="dark" size="large" />
          <Button text="." type="dark" />
          <Button text="=" type="orange" />
        </Row>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: 20,
    paddingBottom: 40,
    justifyContent: 'flex-end',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 40,
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
  },
  closeBtn: {
    padding: 8,
  },
  closeText: {
    color: '#ff9f0a',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  displayContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingBottom: 20,
    paddingHorizontal: 10,
    marginTop: 100,
  },
  displayText: {
    color: '#ffffff',
    fontSize: 84,
    fontWeight: '300',
    textAlign: 'right',
  },
  pad: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    height: buttonSize,
    borderRadius: buttonSize / 2,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  btnGray: {
    backgroundColor: '#a5a5a5',
  },
  btnOrange: {
    backgroundColor: '#ff9f0a',
  },
  btnDark: {
    backgroundColor: '#333333',
  },
  btnLarge: {
    flex: 2,
    alignItems: 'flex-start',
    paddingLeft: 30,
  },
  btnText: {
    fontSize: 30,
    fontWeight: '400',
  },
  textLight: {
    color: '#ffffff',
  },
  textDark: {
    color: '#000000',
  },
  textLarge: {
    textAlign: 'left',
  },
});
