import { Account } from '../auth/models/account.model.js';
import { Order } from '../order/models/order.model.js';

export class AdminService {
  // Customer management methods
  async getCustomers(page: number = 1, limit: number = 10, search?: string, status?: string) {
    try {
      const skip = (page - 1) * limit;

      const matchStage: any = { role: 'CUSTOMER' };

      if (status) {
        matchStage.isActive = status === 'active';
      }

      if (search) {
        matchStage.$or = [
          { fullName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }

      const customers = await Account.find(matchStage)
        .select('fullName email phone isActive isVerified createdAt')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Account.countDocuments(matchStage);

      // Get order statistics for each customer
      const customerIds = customers.map(c => c._id);
      const orderStats = await Order.aggregate([
        { $match: { accountId: { $in: customerIds } } },
        {
          $group: {
            _id: '$accountId',
            totalOrders: { $sum: 1 },
            totalSpent: { $sum: '$total' },
            lastOrderDate: { $max: '$createdAt' }
          }
        }
      ]);

      const statsMap = orderStats.reduce((acc, stat) => {
        acc[stat._id.toString()] = stat;
        return acc;
      }, {} as Record<string, any>);

      const customersWithStats = customers.map(customer => {
        const stats = statsMap[customer._id.toString()] || {};
        return {
          ...customer.toObject(),
          totalOrders: stats.totalOrders || 0,
          totalSpent: stats.totalSpent || 0,
          lastOrderDate: stats.lastOrderDate
        };
      });

      return {
        customers: customersWithStats,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Get customers error:', error);
      throw error;
    }
  }

  async getCustomerById(id: string) {
    try {
      const customer = await Account.findOne({ _id: id, role: 'CUSTOMER' })
        .select('fullName email phone isActive isVerified createdAt');

      if (!customer) return null;

      // Get customer's order statistics
      const orderStats = await Order.aggregate([
        { $match: { accountId: customer._id } },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalSpent: { $sum: '$total' },
            lastOrderDate: { $max: '$createdAt' },
            orders: {
              $push: {
                id: '$_id',
                code: '$code',
                total: '$total',
                status: '$status',
                createdAt: '$createdAt'
              }
            }
          }
        }
      ]);

      const stats = orderStats[0] || {
        totalOrders: 0,
        totalSpent: 0,
        lastOrderDate: null,
        orders: []
      };

      return {
        ...customer.toObject(),
        stats: {
          totalOrders: stats.totalOrders,
          totalSpent: stats.totalSpent,
          lastOrderDate: stats.lastOrderDate,
          orders: stats.orders.slice(0, 10) // Last 10 orders
        }
      };
    } catch (error) {
      console.error('Get customer by id error:', error);
      throw error;
    }
  }

  async updateCustomer(id: string, updateData: any) {
    try {
      const allowedFields = ['fullName', 'email', 'phone', 'isActive', 'isVerified'];
      const filteredData = Object.keys(updateData)
        .filter(key => allowedFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = updateData[key];
          return obj;
        }, {} as any);

      const customer = await Account.findOneAndUpdate(
        { _id: id, role: 'CUSTOMER' },
        filteredData,
        { new: true }
      ).select('fullName email phone isActive isVerified createdAt');

      return customer;
    } catch (error) {
      console.error('Update customer error:', error);
      throw error;
    }
  }

  async banCustomer(id: string, reason?: string) {
    try {
      const customer = await Account.findOneAndUpdate(
        { _id: id, role: 'CUSTOMER' },
        {
          isActive: false,
          banReason: reason,
          bannedAt: new Date()
        },
        { new: true }
      ).select('fullName email phone isActive isVerified createdAt banReason bannedAt');

      return customer;
    } catch (error) {
      console.error('Ban customer error:', error);
      throw error;
    }
  }

  async unbanCustomer(id: string) {
    try {
      const customer = await Account.findOneAndUpdate(
        { _id: id, role: 'CUSTOMER' },
        {
          isActive: true,
          banReason: null,
          bannedAt: null
        },
        { new: true }
      ).select('fullName email phone isActive isVerified createdAt banReason bannedAt');

      return customer;
    } catch (error) {
      console.error('Unban customer error:', error);
      throw error;
    }
  }

  // Account management methods (Admin/Staff)
  async getAccounts(page: number = 1, limit: number = 10, search?: string, role?: string, status?: string) {
    try {
      const skip = (page - 1) * limit;

      const matchStage: any = { role: { $in: ['ADMIN', 'STAFF'] } };

      if (role) {
        matchStage.role = role;
      }

      if (status) {
        matchStage.isActive = status === 'active';
      }

      if (search) {
        matchStage.$or = [
          { fullName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }

      const accounts = await Account.find(matchStage)
        .select('fullName email phone role isActive isVerified createdAt lastLogin')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Account.countDocuments(matchStage);

      return {
        accounts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Get accounts error:', error);
      throw error;
    }
  }

  async createAccount(accountData: any) {
    try {
      const { fullName, email, password, phone, role = 'STAFF' } = accountData;

      // Check if email already exists
      const existingAccount = await Account.findOne({ email });
      if (existingAccount) {
        throw new Error('Email already exists');
      }

      const account = new Account({
        fullName,
        email,
        passwordHash: password, // Will be hashed by pre-save middleware
        phone,
        role,
        isActive: true,
        isVerified: true // Admin-created accounts are auto-verified
      });

      await account.save();
      return account;
    } catch (error) {
      console.error('Create account error:', error);
      throw error;
    }
  }

  async getAccountById(id: string) {
    try {
      const account = await Account.findById(id)
        .select('fullName email phone role isActive isVerified createdAt lastLogin');

      return account;
    } catch (error) {
      console.error('Get account by id error:', error);
      throw error;
    }
  }

  async updateAccount(id: string, updateData: any) {
    try {
      const allowedFields = ['fullName', 'email', 'phone', 'isActive', 'isVerified'];
      const filteredData = Object.keys(updateData)
        .filter(key => allowedFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = updateData[key];
          return obj;
        }, {} as any);

      const account = await Account.findByIdAndUpdate(id, filteredData, { new: true })
        .select('fullName email phone role isActive isVerified createdAt lastLogin');

      return account;
    } catch (error) {
      console.error('Update account error:', error);
      throw error;
    }
  }

  async deleteAccount(id: string) {
    try {
      const result = await Account.findByIdAndDelete(id);
      return result;
    } catch (error) {
      console.error('Delete account error:', error);
      throw error;
    }
  }

  async changeAccountRole(id: string, newRole: string) {
    try {
      const account = await Account.findByIdAndUpdate(
        id,
        { role: newRole },
        { new: true }
      ).select('fullName email phone role isActive isVerified createdAt lastLogin');

      return account;
    } catch (error) {
      console.error('Change account role error:', error);
      throw error;
    }
  }

  async toggleAccountStatus(id: string) {
    try {
      const account = await Account.findById(id);
      if (!account) return null;

      account.isActive = !account.isActive;
      await account.save();

      return account;
    } catch (error) {
      console.error('Toggle account status error:', error);
      throw error;
    }
  }
}

