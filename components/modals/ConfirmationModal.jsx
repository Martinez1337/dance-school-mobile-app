import { View, Text, Modal, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Checkbox } from 'expo-checkbox';
import { useState } from 'react';

const ConfirmationModal = ({ 
  visible, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText, 
  cancelText, 
  askForNeighbours = false 
}) => {
  const [allowNeighbours, setAllowNeighbours] = useState(false);

  const handleConfirm = () => {
    if (askForNeighbours) {
      onConfirm(allowNeighbours);
      setAllowNeighbours(false);
    } else {
      onConfirm()
    }
  };

  const handleClose = () => {
    onClose();
    setAllowNeighbours(false); // Сбрасываем значение при закрытии
  };

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback>
            <View style={styles.modalView}>
              <Text style={styles.modalTitleText}>{title}</Text>
              <Text style={styles.modalText}>{message}</Text>
              
              {askForNeighbours && (
                <TouchableOpacity 
                  style={styles.checkboxContainer}
                  onPress={() => setAllowNeighbours(!allowNeighbours)}
                >
                  <Checkbox
                    value={allowNeighbours}
                    onValueChange={setAllowNeighbours}
                    color={allowNeighbours ? '#d903e4' : undefined}
                    style={styles.checkbox}
                  />
                  <Text style={styles.checkboxLabel}>Разрешить соседей</Text>
                </TouchableOpacity>
              )}
              
              <View style={styles.buttonsContainer}>
                <TouchableOpacity 
                  style={styles.confirmButton} 
                  onPress={handleConfirm}
                >
                  <Text style={styles.buttonText}>{confirmText}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.cancelButton} 
                  onPress={handleClose}
                >
                  <Text style={styles.cancelButtonText}>{cancelText}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalView: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    elevation: 5,
    width: '100%',
    maxWidth: 350,
  },
  modalTitleText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'os-bold',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    fontFamily: 'os-regular',
    lineHeight: 22,
    paddingHorizontal: 4,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxLabel: {
    fontSize: 16,
    fontFamily: 'os-regular',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 4,
  },
  confirmButton: {
    backgroundColor: '#d903e4',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 20,
    flexBasis: '48%',
  },
  cancelButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 20,
    flexBasis: '48%',
    backgroundColor: 'transparent',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'os-bold',
  },
  cancelButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'os-bold',
  },
});

export default ConfirmationModal;
