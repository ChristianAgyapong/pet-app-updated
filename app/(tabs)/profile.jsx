import { View, Text, SafeAreaView, StyleSheet, Pressable } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import Colors from '../../constants/Colors';

export default function Profile() {
  const { user, signOut } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Profile</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.nameText}>
          {user?.firstName} {user?.lastName}
        </Text>
        <Text style={styles.emailText}>{user?.emailAddresses[0].emailAddress}</Text>
        <Pressable 
          style={styles.signOutButton}
          onPress={() => signOut()}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  header: {
    padding: 20,
    backgroundColor: Colors.WHITE,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: Colors.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.BLACK,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.BLACK,
    marginBottom: 8,
  },
  emailText: {
    fontSize: 16,
    color: Colors.GRAY,
    marginBottom: 24,
  },
  signOutButton: {
    backgroundColor: Colors.PRIMARY,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  signOutText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },
});