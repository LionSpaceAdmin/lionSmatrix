"use client";

import { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerTrigger, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ArrowUpDown } from 'lucide-react';

// Mock data
const mockData = [
  { id: 'usr-1', name: 'BotNet Alpha', status: 'Active', threat: 'High', detected: '2024-09-20' },
  { id: 'usr-2', name: 'TrollFarm Gamma', status: 'Active', threat: 'Medium', detected: '2024-09-18' },
  { id: 'usr-3', name: 'SockPuppet X', status: 'Dormant', threat: 'Low', detected: '2024-08-12' },
  { id: 'usr-4', name: 'ClickFarm Zeta', status: 'Active', threat: 'High', detected: '2024-09-22' },
];

type SortKey = keyof typeof mockData[0];

export function TrackerClient() {
  const [sortKey, setSortKey] = useState<SortKey>('detected');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sortedData = useMemo(() => {
    return [...mockData].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [sortKey, sortOrder]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort('name')}>Name <ArrowUpDown className="h-4 w-4 ml-2 inline" /></Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort('status')}>Status <ArrowUpDown className="h-4 w-4 ml-2 inline" /></Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort('threat')}>Threat <ArrowUpDown className="h-4 w-4 ml-2 inline" /></Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort('detected')}>Detected <ArrowUpDown className="h-4 w-4 ml-2 inline" /></Button>
            </TableHead>
            <TableHead className="text-right">Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell><Badge variant={item.status === 'Active' ? 'default' : 'secondary'}>{item.status}</Badge></TableCell>
              <TableCell><Badge variant={item.threat === 'High' ? 'destructive' : 'outline'}>{item.threat}</Badge></TableCell>
              <TableCell>{item.detected}</TableCell>
              <TableCell className="text-right">
                <Drawer>
                  <DrawerTrigger asChild><Button variant="outline">View</Button></DrawerTrigger>
                  <DrawerContent>
                    <div className="mx-auto w-full max-w-sm">
                      <DrawerHeader>
                        <DrawerTitle>{item.name}</DrawerTitle>
                        <DrawerDescription>Details for this entity.</DrawerDescription>
                      </DrawerHeader>
                      <div className="p-4">
                        <p>Status: {item.status}</p>
                        <p>Threat Level: {item.threat}</p>
                        <p>First Detected: {item.detected}</p>
                      </div>
                      <DrawerFooter>
                        <DrawerClose asChild><Button variant="outline">Close</Button></DrawerClose>
                      </DrawerFooter>
                    </div>
                  </DrawerContent>
                </Drawer>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
