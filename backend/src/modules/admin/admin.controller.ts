import { Request, Response } from 'express';
import { AdminService } from './admin.service.js';

export class AdminController {
  private adminService = new AdminService();

  // Customer management
  async getCustomers(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, search, status } = req.query;
      const result = await this.adminService.getCustomers(
        Number(page),
        Number(limit),
        search as string,
        status as string
      );
      res.json(result);
    } catch (error) {
      console.error('Get customers error:', error);
      res.status(500).json({ message: 'Failed to fetch customers' });
    }
  }

  async getCustomerById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const customer = await this.adminService.getCustomerById(id);
      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }
      res.json(customer);
    } catch (error) {
      console.error('Get customer by id error:', error);
      res.status(500).json({ message: 'Failed to fetch customer' });
    }
  }

  async updateCustomer(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const customer = await this.adminService.updateCustomer(id, updateData);
      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }
      res.json(customer);
    } catch (error) {
      console.error('Update customer error:', error);
      res.status(500).json({ message: 'Failed to update customer' });
    }
  }

  async banCustomer(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const customer = await this.adminService.banCustomer(id, reason);
      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }
      res.json({ message: 'Customer banned successfully', customer });
    } catch (error) {
      console.error('Ban customer error:', error);
      res.status(500).json({ message: 'Failed to ban customer' });
    }
  }

  async unbanCustomer(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const customer = await this.adminService.unbanCustomer(id);
      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }
      res.json({ message: 'Customer unbanned successfully', customer });
    } catch (error) {
      console.error('Unban customer error:', error);
      res.status(500).json({ message: 'Failed to unban customer' });
    }
  }

  // Account management (Admin/Staff)
  async getAccounts(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10, search, role, status } = req.query;
      const result = await this.adminService.getAccounts(
        Number(page),
        Number(limit),
        search as string,
        role as string,
        status as string
      );
      res.json(result);
    } catch (error) {
      console.error('Get accounts error:', error);
      res.status(500).json({ message: 'Failed to fetch accounts' });
    }
  }

  async createAccount(req: Request, res: Response) {
    try {
      const accountData = req.body;
      const account = await this.adminService.createAccount(accountData);
      res.status(201).json(account);
    } catch (error) {
      console.error('Create account error:', error);
      res.status(500).json({ message: 'Failed to create account' });
    }
  }

  async getAccountById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const account = await this.adminService.getAccountById(id);
      if (!account) {
        return res.status(404).json({ message: 'Account not found' });
      }
      res.json(account);
    } catch (error) {
      console.error('Get account by id error:', error);
      res.status(500).json({ message: 'Failed to fetch account' });
    }
  }

  async updateAccount(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const account = await this.adminService.updateAccount(id, updateData);
      if (!account) {
        return res.status(404).json({ message: 'Account not found' });
      }
      res.json(account);
    } catch (error) {
      console.error('Update account error:', error);
      res.status(500).json({ message: 'Failed to update account' });
    }
  }

  async deleteAccount(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await this.adminService.deleteAccount(id);
      if (!result) {
        return res.status(404).json({ message: 'Account not found' });
      }
      res.json({ message: 'Account deleted successfully' });
    } catch (error) {
      console.error('Delete account error:', error);
      res.status(500).json({ message: 'Failed to delete account' });
    }
  }

  async changeAccountRole(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { role } = req.body;
      const account = await this.adminService.changeAccountRole(id, role);
      if (!account) {
        return res.status(404).json({ message: 'Account not found' });
      }
      res.json({ message: 'Account role updated successfully', account });
    } catch (error) {
      console.error('Change account role error:', error);
      res.status(500).json({ message: 'Failed to change account role' });
    }
  }

  async toggleAccountStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const account = await this.adminService.toggleAccountStatus(id);
      if (!account) {
        return res.status(404).json({ message: 'Account not found' });
      }
      res.json({ message: 'Account status updated successfully', account });
    } catch (error) {
      console.error('Toggle account status error:', error);
      res.status(500).json({ message: 'Failed to toggle account status' });
    }
  }
}

