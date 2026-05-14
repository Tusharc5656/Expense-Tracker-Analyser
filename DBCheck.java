import java.sql.*;

public class DBCheck {
    public static void main(String[] args) {
        try {
            Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/expense_tracker?useSSL=false", "root", "12345t");
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT id, title, amount, category, date, user_id FROM expenses");
            System.out.println("--- EXPENSES TABLE ---");
            while (rs.next()) {
                System.out.println("ID: " + rs.getInt("id") + " | Title: " + rs.getString("title") + " | Amount: " + rs.getDouble("amount") + " | Date: " + rs.getDate("date") + " | UserID: " + rs.getInt("user_id"));
            }
            conn.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
