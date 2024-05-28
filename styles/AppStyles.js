import { StyleSheet, Platform, StatusBar } from 'react-native';

export const AppStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  menuContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },

  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },

  safeArea: {
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },

  header: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: '#fff',
  },

  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10, // 타이틀 텍스트와의 간격
  },

  menuButton: {
    marginRight: 10, // 메뉴 아이콘과 로고 텍스트 사이의 간격
  },

  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },

  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',

  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },

  date: {
    fontSize: 16,
    marginRight: 5,
  },

  mealContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 20,
  },

  mealCard: {
    flex: 1,
    marginHorizontal: 5,
  },

  mealTitle: {
    textAlign: 'center',
  },

  mealContent: {
    alignItems: 'center',
  },

  mealImage: {
    width: '100%',
    height: 150,
  },

  imagePicker: {
    width: '100%',
    height: 150,
    backgroundColor: '#eeeeee',
    justifyContent: 'center',
    alignItems: 'center',
  },

  imagePickerText: {
    fontSize: 16,
    color: '#888888',
  },

  nutritionButton: {
    paddingHorizontal: 10,
  },

  nutritionButtonText: {
    fontSize: 14,
  },

  nutritionContainer: {
    marginTop: 20,
  },

  nutritionText: {
    fontSize: 18,
    marginBottom: 10,
  },

  nutritionLabel: {
    fontWeight: 'bold',
  },

  nutritionValue: {
    color: '#6200ee',
  },

  nutritionGoal: {
    color: 'green',
  },

  totalIntakeContainer: {
    alignItems: 'center',
    marginTop: 20,
  },

  totalIntakeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  totalIntakeValue: {
    fontSize: 16,
  },

  loadingText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },

  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 20,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },

  goalInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },

  goalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },

  goalContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  goalInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 5,
    paddingHorizontal: 10,
    width: 80,
    textAlign: 'right',
  },

  goalUnit: {
    fontSize: 16,
    marginLeft: 8,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },

  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },

  genderContainer: {
    flexDirection: 'row',
    marginLeft: 10,
  },

  genderButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginRight: 10,
  },

  genderButtonActive: {
    backgroundColor: '#6200ee',
    borderColor: '#6200ee',
  },

  genderButtonText: {
    color: '#000',
  },

  genderButtonTextActive: {
    color: '#fff',
  },

  saveButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 30,
  },

  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  menuItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  menuItemText: {
    fontSize: 18,
  },

  foodButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center', // 버튼을 수평으로 중앙에 정렬
    marginVertical: 20,
  },
  foodButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginHorizontal: 10,
    justifyContent: 'center', // 버튼 내부의 내용을 수직으로 중앙에 정렬
    alignItems: 'center', // 버튼 내부의 내용을 수평으로 중앙에 정렬
  },
  selectedFoodButton: {
    backgroundColor: '#6200ee',
  },
  foodButtonText: {
    fontSize: 16,
    color: '#333',
  },
  selectedFoodButtonText: {
    color: '#fff',
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#ccc',
  },

});